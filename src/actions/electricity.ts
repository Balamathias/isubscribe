import { computeServerTransaction } from "./compute.server"
import { buyElectricity } from "@/lib/vtpass/services"
import generateRequestId from "@/funcs/generateRequestId"
import { PaymentMethod } from "@/types/networks"
import { RESPONSE_CODES } from "@/utils/constants/response-codes"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { insertTransactionHistory, saveCashbackHistory, saveElectricityErrorHistory } from "@/lib/supabase/history"
import { getUser } from "@/lib/supabase/accounts"
import { updateWallet } from "./utils"
import { DATA_MB_PER_NAIRA } from "@/lib/utils"
import { formatDataAmount } from "@/lib/utils"

interface ElectricityPayload {
    meterNumber: string,
    phone: string,
    provider: string,
    variation: "prepaid" | "postpaid",
    amount: string,
    cashback?: string | number,
    price: number,
    method: PaymentMethod
}

export const processElectricity = async (payload: ElectricityPayload) => {

    try {
        const { data: profile } = await getUser()

        const billerPayload = {
            CashBack:payload?.cashback,
            Price: payload?.amount,
            method:payload?.method
          }
      
        const requestPayload = {
            billersCode: payload.meterNumber,
            phone: payload.phone,
            serviceID:payload.provider,
            variation_code: payload.variation,
            amount: payload.amount,
        }
      
        const { error: computeError, data: computeData } = await computeServerTransaction({
              payload: {
                  cashback: 0,
                  price: parseFloat(billerPayload.Price),
                  method: billerPayload.method
              },
        })
          
        if (computeError || !computeData) return {
            error: { message: computeError },
            data: null
        }
      
        const { balance, cashbackBalance, cashbackPrice, deductableAmount, price } = computeData
    
        const res = await buyElectricity({
            ...requestPayload as any,
            request_id: generateRequestId()
        })
    
        const metadata = {...res?.content?.transactions, transId: res?.requestId, requestId: res?.requestId}
    
        switch (res?.code) {
    
            case RESPONSE_CODES.TRANSACTION_SUCCESSFUL.code:

                const [
                    { walletUpdate: { 
                        error: balanceError
                    }},
                    { data: _insertSuccessHistory },] = await Promise.all([
                    await updateWallet(profile?.id!, balance, cashbackBalance, deductableAmount),
                    
                    await insertTransactionHistory({
                        description: `Meter subscription for ${payload.meterNumber}`,
                        status: 'success',
                        title: 'Meter Subscription',
                        type: EVENT_TYPE.meter_topup,
                        email: null,
                        meta_data: metadata,
                        updated_at: null,
                        user: profile?.id!,
                        amount: price,
                        commission: res?.content?.transactions?.commission,
                    }),
            
                    cashbackPrice && await saveCashbackHistory({ amount: cashbackPrice })
                ])
                
                if (balanceError) {
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
                        historyId: _insertSuccessHistory?.id,
                        cashbackQuantity: formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA),
                        cashbackPrice,
                    },
                    error: null
                }
    
            case RESPONSE_CODES.TRANSACTION_PENDING.code:

                const [
                    { walletUpdate: { 
                        error:_balanceError 
                    }},
                    { data: _insertHistory }, _] = await Promise.all([
                    await updateWallet(profile?.id!, balance, cashbackBalance, deductableAmount),
                    
                    await insertTransactionHistory({
                        description: `Meter subscription for ${payload.meterNumber}`,
                        status: 'pending',
                        title: 'Meter Subscription',
                        type: EVENT_TYPE.meter_topup,
                        email: null,
                        meta_data: metadata,
                        updated_at: null,
                        user: profile?.id!,
                        amount: price,
                        commission: res?.content?.transactions?.commission,
                    }),
            
                    cashbackPrice && await saveCashbackHistory({ amount: cashbackPrice })
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
                        message: RESPONSE_CODES.TRANSACTION_PENDING.message
                    },
                    extra: {
                        historyId: _insertHistory?.id,
                        cashbackQuantity: formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA),
                        cashbackPrice,
                    },
                    error: null
                }
    
            case undefined:
                await saveElectricityErrorHistory('An unknown error has occured, please try again.', 
                    {meta_data: {...metadata, transId: res?.requestId, status: 'failed', description: `Meter subscription for ${payload.meterNumber} failed.`}, price, mobile: payload.phone, meterNumber: payload.meterNumber}
                )
                return {
                    error: {
                        message: 'An unknown error has occured, please try again.',
                    },
                    data: null
                }
            
                case RESPONSE_CODES.TIME_NOT_CORRECT.code:
                    await saveElectricityErrorHistory(RESPONSE_CODES.TIME_NOT_CORRECT.message, 
                        {meta_data: {...metadata, transId: res?.requestId, status: 'failed', description: res?.response_description}, price, mobile: payload.phone, meterNumber: payload.meterNumber}
                    )
                    return {
                        error: {
                            message: RESPONSE_CODES.TIME_NOT_CORRECT.message
                        },
                        data: null
                    }
        
                case RESPONSE_CODES.TRANSACTION_FAILED.code:
                    await saveElectricityErrorHistory(RESPONSE_CODES.TRANSACTION_FAILED.message, 
                        {meta_data: {...metadata, transId: res?.requestId, status: 'failed', description: res?.response_description}, price, mobile: payload.phone, meterNumber: payload.meterNumber}
                    )
                    return {
                        error: {
                            message: RESPONSE_CODES.TRANSACTION_FAILED.message
                        },
                        data: null
                    }
        
                case RESPONSE_CODES.NO_PRODUCT_VARIATION.code:
                    await saveElectricityErrorHistory(RESPONSE_CODES.NO_PRODUCT_VARIATION.message, 
                        {meta_data: {...metadata, transId: res?.requestId, status: 'failed', description: res?.response_description}, price, mobile: payload.phone, meterNumber: payload.meterNumber}
                    )
                    return {
                        error: {
                            message: RESPONSE_CODES.NO_PRODUCT_VARIATION.message
                        },
                        data: null
                    }
        
                case RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.code:
                    await saveElectricityErrorHistory(RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message, 
                        {meta_data: {...metadata, transId: res?.requestId, status: 'failed', description: res?.response_description}, price, mobile: payload.phone, meterNumber: payload.meterNumber}
                    )
                    return {
                        error: {
                            message: RESPONSE_CODES.PRODUCT_DOES_NOT_EXIST.message
                        },
                        data: null
                    }
    
                case RESPONSE_CODES.LOW_WALLET_BALANCE.code:
                    await saveElectricityErrorHistory(RESPONSE_CODES.LOW_WALLET_BALANCE.message, 
                        {meta_data: {...metadata, transId: res?.requestId, status: 'failed', description: res?.response_description}, price, mobile: payload.phone, meterNumber: payload.meterNumber}
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
                message: error?.messaage || 'An unknown error has occured, please try again.',
            },
            data: null
        }
    }

}