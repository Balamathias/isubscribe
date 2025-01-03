import { RequestId } from "@/@types/id"
import { WebhookResponse_N3T } from "@/@types/webhooks"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
    const response: WebhookResponse_N3T = await req.json()

    const supabase = createClient()

    if (response?.["request-id"]?.startsWith('Data')) {
        if (response?.status === 'success') {

            const [_, reqId, userId, amount, network, phone, dataAmt, commission] = (response?.["request-id"] as RequestId).split("_")
    
            const { data: transaction } = await supabase.from('history')
                .select('*')
                .or(`request_id.eq.${response?.["request-id"]}, meta_data->transId.eq.${response?.["request-id"]}`)
                .eq('user', userId)
                .single()
    
            if (transaction) {
                // const { error } = await supabase
                //     .from('history')
                //     .update({ status: 'success' })
                //     .eq('id', transaction.id)
    
                // if (error) {
                //     console.error("Failed to update transaction status:", error)
                //     return NextResponse.json({ message: "Internal server error" }, { status: 500 })
                // }
    
                console.log(transaction)
            } else {
    
    
                // const { error } = await supabase.from('history').insert([{
                //     user: userId,
                //     amount: parseInt(amount),
                //     status: 'success',
                //     request_id: reqId,
                //     meta_data: { transId: response?.["request-id"] }
                // }])
                console.log("ON ELSE: ", response)
            }
            
            console.log("Success: ", response)
        }
    
        else if (response?.status === 'pending') {
            const { data: transaction } = await supabase.from('history')
                .select('*')
                .or(`request_id.eq.${response?.["request-id"]},meta_data->transId.eq.${response?.["request-id"]}`)
                .single()
    
            if (transaction) {
                const { error } = await supabase
                    .from('history')
                    .update({ status: 'pending' })
                    .eq('id', transaction.id)
    
                if (error) {
                    console.error("Failed to update transaction status:", error)
                }
            }
        }
        
        else if ((response?.status === 'failed' || response?.status === 'error')) {
    
            const [_, reqId, userId, amount, network, phone, dataAmt, commission] = (response?.["request-id"] as RequestId).split("_")
    
            const { data: transaction } = await supabase.from('history')
                .select('*')
                .or(`request_id.eq.${response?.["request-id"]},meta_data->transId.eq.${response?.["request-id"]}`)
                .single()
    
            if (transaction) {
                const { error } = await supabase
                    .from('history')
                    .update({ 
                        status: 'failed',
                        error_message: response.response || 'Transaction failed'
                    })
                    .eq('id', transaction.id)
    
                if (error) {
                    console.error("Failed to update transaction status:", error)
                    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
                }
    
                const userWallet = await supabase.from("wallet")
                    .select('balance')
                    .eq('user', userId)
                    .single()
    
                if (userWallet?.error) {
                    console.error("Failed to update transaction status:", error)
                    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
                }
    
                await supabase.from('wallet')
                    .update({ balance: (userWallet?.data?.balance ?? 0) + (parseInt(amount))})
                    .eq('user', userId)
    
                await supabase.from('history')
                    .insert({
                        amount: parseFloat(amount),
                        commission: parseFloat(commission),
                        description: 'Reversed',
                        title: 'Transaction Reversed',
                        provider: 'n3t',
                        status: 'success',
                        type: EVENT_TYPE.reverse_transaction,
                        request_id: `${reqId}_${userId}_${amount}_${network}_${phone}_${dataAmt}_${commission}`,
                        transaction_id: reqId,
                        user: userId,
                        meta_data: {
                            transId: response?.["request-id"],
                            original_transaction: transaction.id,
                            original_status: transaction.status,
                            original_amount: transaction.amount,
                            network,
                            dataQty: dataAmt,
    
                        }
                    })
            }
            
            console.error("Failed transaction:", response)
        }
        
        else {
            console.warn("Unhandled webhook status:", response.status)
        }    
    }
    
    return NextResponse.json({ message: "Success!" }, { status: 200 })
}