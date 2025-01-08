"use server"

import generateRequestId from "@/funcs/generateRequestId"
import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import { insertTransactionHistory, saveAirtimeErrorHistory, saveCashbackHistory, saveDataErrorHistory } from "@/lib/supabase/history";
import { AirtimeDataMetadata } from "@/types/airtime-data";
import { getUser } from "@/lib/supabase/accounts";
import { DATA_MB_PER_NAIRA } from "@/lib/utils";
import { formatDataAmount } from "@/lib/utils";
import { updateCashbackBalanceByUser } from "@/lib/supabase/wallets";
import { updateWalletBalanceByUser } from "@/lib/supabase/wallets";
import { computeServerTransaction } from "./compute.server";
import { Networks, PaymentMethod } from "@/types/networks";
import { RESPONSE_CODES } from "@/utils/constants/response-codes";
import { buyAirtime } from "@/lib/vtpass/services";
import { VTPassAirtimeTransactionRequest } from "@/lib/vtpass";
import { updateWallet } from "./utils";
import { saveBeneficiary } from "@/lib/supabase/beneficiaries";

interface ProcessAirtime_VTPass {
    phone: string;
    currentNetwork: Networks;
    payload: {
        price: number;
        cashback: number;
        method?: PaymentMethod;
        commission?: number;
    };
    serviceID: VTPassAirtimeTransactionRequest['serviceID'],
    variation_code?: string;
    meta_data: AirtimeDataMetadata;
}

export const processAirtime_VTPass = async ({
    phone,
    meta_data,
    payload,
    currentNetwork,
    serviceID,
}: ProcessAirtime_VTPass) => {

    
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
        console.log({values, payload})

        if (!profile) {
            return {
                error: {
                    message: 'Failed to initiate transaction, please try again.'
                },
                data: null
            }
        }
    
        const reqId = generateRequestId()
    
        const res = await buyAirtime({
            ...payload, 
            phone,
            request_id: reqId,
            serviceID,
            amount: payload.price
        })

        saveBeneficiary(phone)
    
    
        switch (res?.code) {

            case RESPONSE_CODES.TRANSACTION_SUCCESSFUL.code:            

                const [
                    { walletUpdate: { 
                        error:_balanceError 
                    }},
                    { data: _insertHistory }, _] = await Promise.all([
                    await updateWallet(profile?.id!, balance, cashbackBalance, deductableAmount),

                    await insertTransactionHistory({
                        description: `Airtime subscription topped-up for ${phone} successfully.`,
                        status: 'success',
                        title: 'Airtime Subscription.',
                        email: null,
                        meta_data: JSON.stringify({...meta_data, transId: res?.requestId, status: 'success', description: res?.response_description}),
                        updated_at: null,
                        user: profile?.id!,
                        amount: price,
                        provider: 'vtpass',
                        type: EVENT_TYPE.airtime_topup,
                        commission: res?.content?.transactions?.commission || commission,
                    }),
            
                    await saveCashbackHistory({ amount: cashbackPrice })
                ])

                if (_balanceError) {
                    return {
                        error: {
                            message: `Failed to charge wallet, stay tuned for transaction updates.`
                        },
                        data: null
                    }
                }

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
                await saveAirtimeErrorHistory(RESPONSE_CODES.TIME_NOT_CORRECT.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TIME_NOT_CORRECT.message}, price, mobile: phone})
                return {
                    error: {
                        message: RESPONSE_CODES.TIME_NOT_CORRECT.message
                    },
                    data: null
                }
    
            case RESPONSE_CODES.TRANSACTION_FAILED.code:
                await saveAirtimeErrorHistory(RESPONSE_CODES.TRANSACTION_FAILED.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TRANSACTION_FAILED.message}, price, mobile: phone})
                return {
                    error: {
                        message: RESPONSE_CODES.TRANSACTION_FAILED.message
                    },
                    data: null
                }
    
            case RESPONSE_CODES.NO_PRODUCT_VARIATION.code:
                await saveAirtimeErrorHistory(RESPONSE_CODES.NO_PRODUCT_VARIATION.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.NO_PRODUCT_VARIATION.message}, price, mobile: phone})
                return {
                    error: {
                        message: RESPONSE_CODES.NO_PRODUCT_VARIATION.message
                    },
                    data: null
                }
    
            case RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.code:
                await saveAirtimeErrorHistory(RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message}, price, mobile: phone})
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
    
            default: 
                return {
                    error: {
                        message: `An attempt to initiate this transaction timed out for unknown reasons, please try again.`
                    },
                    data: null
                }
        }
    } catch (error: any) {
        console.error(error)
        return {
            error: {
                message: error?.message || 'An unknown error has occured, please try again.'
            },
            data: null
        }
    }
        
}