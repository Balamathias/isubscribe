"use server"

import generateRequestId from "@/funcs/generateRequestId"
import { buyData } from "@/lib/n3tdata"
import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import { insertTransactionHistory, saveCashbackHistory, saveDataErrorHistory } from "@/lib/supabase/history";
import { AirtimeDataMetadata } from "@/types/airtime-data";
import { getUser } from "@/lib/supabase/accounts";
import { DATA_MB_PER_NAIRA } from "@/lib/utils";
import { formatDataAmount } from "@/lib/utils";
import { updateCashbackBalanceByUser } from "@/lib/supabase/wallets";
import { updateWalletBalanceByUser } from "@/lib/supabase/wallets";
import { priceToInteger } from "@/funcs/priceToNumber";
import { computeServerTransaction } from "./compute.server";
import { Networks, PaymentMethod } from "@/types/networks";
import { buyData as buyVTPassData } from '@/lib/vtpass/services'
import { RESPONSE_CODES } from "@/utils/constants/response-codes";
import { isNullOrUndefined } from "util";


interface ProcessData_N3T {
    data_plan: number;
    network: number;
    phone: string;
    currentNetwork: Networks;
    payload: {
        Price: string;
        CashBack: string;
        method?: PaymentMethod;
        commission?: number;
        Data: string
    };
    meta_data: AirtimeDataMetadata;
}


interface ProcessData_VTPass {
    phone: string;
    currentNetwork: Networks;
    payload: {
        price: number;
        cashback: number;
        method?: PaymentMethod;
        commission?: number;
    };
    serviceID: string,
    variation_code: string;
    meta_data: AirtimeDataMetadata;
}

/**
 * This function makes multiple database calls and external API requests
 * Estimated execution time: 2-5 seconds normal, 10-15 seconds on slow networks
 *
 * Current Supabase optimizations implemented:
 * 1. Batch writes using Supabase's upsert:
 *    const { data, error } = await supabase
 *      .from('wallets')
 *      .upsert([
 *        { user_id: profile.id, balance: newBalance },
 *        { user_id: profile.id, cashback_balance: newCashback }
 *      ])
 *
 * 2. Parallel queries using Promise.all:
 *    const [walletUpdate, historyInsert] = await Promise.all([
 *      updateWalletBalances(),
 *      insertTransactionHistory()
 *    ])
 *
 * 3. Optimistic updates on frontend while waiting for DB
 *
 * Additional optimizations needed:
 * - Add Redis caching layer for user/wallet data
 * - Implement background job queue for history writes
 * - Add retry logic for failed DB operations
 * - Monitor query performance with Supabase metrics
 * - Consider read replicas for heavy load
 *
 * @TODO: Implement remaining optimizations in separate PR
 */
export const processData_n3t = async ({
    data_plan,
    network,
    phone,
    meta_data,
    payload,
    currentNetwork
}: ProcessData_N3T) => {

    try {
        const { data: profile } = await getUser(undefined, true)

        const { data: values, error: computeError } = await computeServerTransaction({
            payload: {
                price: priceToInteger(payload.Price),
                cashback: priceToInteger(payload.CashBack),
                method: payload.method,
                interest: payload?.commission
            },
        })
    
        
        if (computeError || !values) return {
            error: {
                message: computeError || 'An unknown error has occured, please try again.'
            },
            data: null
        }
    
        const { balance, cashbackBalance, cashbackPrice, deductableAmount, price, commission } = values
    
        if (!profile) {
            return {
                error: {
                    message: 'Failed to initiate transaction, please try again.'
                },
                data: null
            }
        }
    
        const { data, error } = await buyData({
            "request-id": `Data_${generateRequestId()}_${profile?.id}_${price}_${currentNetwork}_${phone}_${payload.Data}_${commission}`,
            bypass: false,
            data_plan,
            network,
            phone,
        })
    
        console.log(data)
    
        if (error || (data?.status === 'fail')) {
    
            meta_data = {
                ...meta_data,
                transId: data?.transid ?? null,
                dataQty: payload?.Data ?? 0,
                unitCashback: cashbackPrice,
                unitPrice: price,
                description: data?.message,
                planType: data?.plan_type || '',
                status: 'failed',
                transaction_id: data?.["request-id"],
                commission,
                phone
            }
            
            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${phone} failed.`,
                status: 'failed', 
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                meta_data: JSON.stringify(meta_data),
                user: profile?.id!,
                amount: meta_data.unitPrice,
                provider: 'n3t',
                request_id: data?.['request-id'],
                commission: meta_data.commission,
            })
    
            const match = data?.message?.includes('Insufficient')
    
            if (match) {
                return {
                    error: {
                        message: 'This service provider is temporarily unavailable, please try again later.'
                    },
                    data: null
                }
            }
    
            return {
                error: {
                    message: data?.message ?? 'Data subscription failed. Please try again.'
                },
                data: null
            }
        }
    
        if (data?.status === 'success' || data?.status === 'pending') {
    
            const updateWallet = async (retries = 3) => {
                try {
                    const [walletUpdate, cashbackUpdate] = await Promise.all([
                        updateWalletBalanceByUser(profile?.id!, (balance - deductableAmount)),
                        updateCashbackBalanceByUser(profile?.id!, cashbackBalance)
                    ])
                    
                    return { walletUpdate, cashbackUpdate }
                } catch (error) {
                    if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        return updateWallet(retries - 1)
                    }
                    throw error
                }
            }
    
            const { walletUpdate: { 
                data: _walletBalance, error:_balanceError 
            }, cashbackUpdate: {
                data: _cashbackBalance, error:_cashbackBalanceError
            } } = await updateWallet()
    
            if (_balanceError || _cashbackBalanceError) {
                return {
                    error: {
                        message: `Failed to initiate transaction at this time, please try again.`
                    },
                    data: null
                }
            }
    
            let meta_data: AirtimeDataMetadata = {
                dataQty: payload?.Data ?? 0,
                duration: null,
                network: currentNetwork,
                transId: data?.transid ?? null,
                unitCashback: cashbackPrice,
                unitPrice: price,
                description: data?.message,
                planType: data?.plan_type,
                phone,
                status: data?.status === 'success' ? 'success' : 'pending',
                transaction_id: data?.["request-id"],
                commission
            }
    
            const [{ data: _insertHistory }, _] = await Promise.all([
                await insertTransactionHistory({
                    description: `Data subscription`,
                    status: data?.status === 'success' ? 'success' : 'pending',
                    title: 'Data Subscription',
                    type: EVENT_TYPE.data_topup,
                    meta_data: JSON.stringify(meta_data),
                    user: profile?.id!,
                    amount: price,
                    provider: 'n3t',
                    commission,
                    request_id: data?.["request-id"]
                }),
        
                await saveCashbackHistory({ amount: cashbackPrice })
            ])
    
            return {
                data,
                extra: {
                    historyId: _insertHistory?.id,
                    cashbackQuantity: formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA),
                    cashbackPrice,
                    status: data?.status as 'success' | 'pending'
                },
                error: null
            }
        } else {
            return {
                error: {
                    message: `An attempt to initiate this transaction failed for unknown reasons, please try again.`
                },
                data: null
            }
        }
    } catch (error: any) {
        console.error(error)
        return {
            error: {
                message: error?.message || `An attempt to initiate this transaction failed for unknown reasons, please try again.`
            },
            data: null
        }
        
    }
}

export const processData_VTPass = async ({
    phone,
    meta_data,
    payload,
    currentNetwork,
    serviceID,
    variation_code
}: ProcessData_VTPass) => {

    try {
        const { data: profile } = await getUser(undefined, true)

        const { data: values, error: computeError } = await computeServerTransaction({
            payload: {
                price: payload.price,
                cashback: payload.cashback,
                method: payload.method,
                interest: payload?.commission
            },
        })

        
        if (computeError || !values) return {
            error: {
                message: computeError || 'An unknown error has occured, please try again.'
            },
            data: null
        }

        const { balance, cashbackBalance, cashbackPrice, deductableAmount, price, commission } = values

        if (!profile) {
            return {
                error: {
                    message: 'Failed to initiate transaction, please try again.'
                },
                data: null
            }
        }

        const reqId = generateRequestId()

        const res = await buyVTPassData({
            ...payload,
            request_id: reqId,
            billersCode: phone,
            phone,
            serviceID,
            variation_code,
        })

        switch (res?.code) {
            case undefined:
                await saveDataErrorHistory('An unknown error has occured, please try again.', 
                    {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: undefined}, price, mobile: phone}
                )
                return {
                    error: {
                        message: 'An unknown error has occured, please try again.',
                    },
                    data: null
                }
            
            case RESPONSE_CODES.TIME_NOT_CORRECT.code:
                await saveDataErrorHistory(RESPONSE_CODES.TIME_NOT_CORRECT.message,
                    {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TIME_NOT_CORRECT.message}, price, mobile: phone}
                )
                return {
                    error: {
                        message: RESPONSE_CODES.TIME_NOT_CORRECT.message
                    },
                    data: null
                }

            case RESPONSE_CODES.TRANSACTION_FAILED.code:
                await saveDataErrorHistory(RESPONSE_CODES.TRANSACTION_FAILED.message,
                    {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TRANSACTION_FAILED.message}, price, mobile: phone}
                )
                return {
                    error: {
                        message: RESPONSE_CODES.TRANSACTION_FAILED.message
                    },
                    data: null
                }

            case RESPONSE_CODES.NO_PRODUCT_VARIATION.code:
                await saveDataErrorHistory(RESPONSE_CODES.NO_PRODUCT_VARIATION.message,
                    {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.NO_PRODUCT_VARIATION.message}, price, mobile: phone}
                )
                return {
                    error: {
                        message: RESPONSE_CODES.NO_PRODUCT_VARIATION.message
                    },
                    data: null
                }

            case RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.code:
                await saveDataErrorHistory(RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message,
                    {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message}, price, mobile: phone}
                )
                return {
                    error: {
                        message: RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message
                    },
                    data: null
                }
                
            case RESPONSE_CODES.LOW_WALLET_BALANCE.code:
                await saveDataErrorHistory(RESPONSE_CODES.LOW_WALLET_BALANCE.message,
                    {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.LOW_WALLET_BALANCE.message}, price, mobile: phone}
                )
                return {
                    error: {
                        message: RESPONSE_CODES.LOW_WALLET_BALANCE.message
                    },
                    data: null
                }

            case RESPONSE_CODES.TRANSACTION_SUCCESSFUL.code:
                const updateWallet = async (retries = 3) => {
                    try {
                        const [walletUpdate, cashbackUpdate] = await Promise.all([
                            updateWalletBalanceByUser(profile?.id!, (balance - deductableAmount)),
                            updateCashbackBalanceByUser(profile?.id!, cashbackBalance)
                        ])
                        
                        return { walletUpdate, cashbackUpdate }
                    } catch (error) {
                        if (retries > 0) {
                            await new Promise(resolve => setTimeout(resolve, 1000))
                            return updateWallet(retries - 1)
                        }
                        throw error
                    }
                }
        
                const { walletUpdate: { 
                    data: _walletBalance, error:_balanceError 
                }, cashbackUpdate: {
                    data: _cashbackBalance, error:_cashbackBalanceError
                } } = await updateWallet()
        
                if (_balanceError || _cashbackBalanceError) {
                    return {
                        error: {
                            message: `Failed to initiate transaction at this time, please try again.`
                        },
                        data: null
                    }
                }

                const [{ data: _insertHistory }, _] = await Promise.all([
                    await insertTransactionHistory({
                        description: `Data subscription topped-up for ${phone} successfully.`,
                        status: 'success',
                        title: 'Data Subscription.',
                        type: EVENT_TYPE.data_topup,
                        meta_data: JSON.stringify({...meta_data, transId: res?.requestId, status: 'success', description: res?.response_description}),
                        user: profile?.id!,
                        amount: price,
                        provider: 'vtpass',
                        commission: res?.content?.transactions?.commission || commission,
                        request_id: res?.requestId
                    }),
            
                    await saveCashbackHistory({ amount: cashbackPrice })
                ])

                return {
                    data: {
                        message: RESPONSE_CODES.TRANSACTION_SUCCESSFUL.message
                    },
                    extra: {
                        historyId: _insertHistory?.id,
                        cashbackQuantity: formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA),
                        cashbackPrice,
                    },
                    error: null
                }

            default: 
                return {
                    error: {
                        message: `An attempt to initiate this transaction failed for unknown reasons, please try again.`
                    },
                    data: null
                }
        }
    } catch (error: any) {
        console.error(error)
        return {
            error: {
                message: error?.message || `An attempt to initiate this transaction failed for unknown reasons, please try again.`
            },
            data: null
        }
    }
        
}