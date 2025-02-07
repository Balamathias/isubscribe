import { RequestId } from "@/@types/id"
import { WebhookResponse_N3T } from "@/@types/webhooks"
import { AirtimeDataMetadata } from "@/types/airtime-data"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY as string);
export const runtime = 'edge'

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
                console.log("I got the rts")
                return NextResponse.json({ message: "Success!" }, { status: 200 })
            }

            const metadata: AirtimeDataMetadata = {
                transId: response?.["request-id"],
                transaction_id: reqId,
                status: 'success'!,
                network,
                dataQty: dataAmt,
                duration: null,
                phone,
                planType: null,
                unitCashback: null,
                unitPrice: Number(amount)
            }

            const { error: historyAlreadyExistsError } = await supabase.from('history')
                .insert({
                    amount: parseFloat(amount),
                    commission: parseFloat(commission),
                    description: 'Data subscription',
                    title: 'Data Subscription',
                    provider: 'n3t',
                    status: 'success',
                    type: EVENT_TYPE.data_topup,
                    request_id: response?.["request-id"],
                    transaction_id: reqId,
                    user: userId,
                    meta_data: JSON.stringify(metadata)
                })

            if (historyAlreadyExistsError) {
                console.error("Failed to insert history:", historyAlreadyExistsError)
                return NextResponse.json({ message: "Internal server error" })
            }

            const { data: userWallet } = await supabase.from("wallet")
                .select('balance')
                .eq('user', userId)
                .single()

            const { error: walletError } = await supabase.from('wallet')
                .update({ balance: Math.max((userWallet?.balance ?? 0) - (parseInt(amount)), 0) })
                .eq('user', userId)
            
            return NextResponse.json({ message: "Success!" }, { status: 200 })
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
        
        else if ((response?.status === 'failed' || response?.status === 'fail')) {
    
            const [_, reqId, userId, amount, network, phone, dataAmt, commission] = (response?.["request-id"] as RequestId).split("_")
    
            const { data: transaction } = await supabase.from('history')
                .select('*')
                .eq('request_id', response?.["request-id"])
                .single()
    
            if (transaction) {
    
                const userWallet = await supabase.from("wallet")
                    .select('balance')
                    .eq('user', userId)
                    .single()
    
                if (userWallet?.error) {
                    console.error("Failed to update transaction status:", userWallet?.error)
                    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
                }
    
                await supabase.from('wallet')
                    .update({ balance: Math.max((userWallet?.data?.balance ?? 0) + (parseInt(amount)), 0)})
                    .eq('user', userId)

                    const { error } = await supabase
                    .from('history')
                    .update({ 
                        status: 'reversed',
                        error_message: response.response || 'Transaction Reversed'
                    })
                    .eq('id', transaction.id)
    
                if (error) {
                    console.error("Failed to update transaction status:", error)
                    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
                }

                const user = await supabase.from('profile')
                    .select('email')
                    .eq('id', userId)
                    .single()

                if (user?.data?.email) {
                    resend.emails.send({
                        from: `isubscribe <service@updates.isubscribe.com>`,
                        to: [user?.data?.email],
                        subject: "Transaction Reversed",
                        text: `Hello,\n\nWe regret to inform you that your transaction has been reversed and your wallet has been refunded.\n\nDetails:\nTransaction ID: ${reqId}\nPhone Number: ${phone}\nAmount: ${amount}\nNetwork: ${network}\nData Amount: ${dataAmt}\n\nThanks for choosing isubscribe!`
                    })
                }
            }
            
            console.error("Failed transaction:", response)
        }
        
        else {
            console.warn("Unhandled webhook status:", response.status)
        }    
    }
    
    return NextResponse.json({ message: "Success!" }, { status: 200 })
}


// const metadata: AirtimeDataMetadata = {
//     transId: response?.["request-id"],
//     transaction_id: transaction.id?.toString(),
//     status: transaction.status,
//     network,
//     dataQty: dataAmt,
//     duration: null,
//     phone,
//     planType: null,
//     unitCashback: null,
//     unitPrice: Number(amount)
// }

// await supabase.from('history')
//     .insert({
//         amount: parseFloat(amount),
//         commission: parseFloat(commission),
//         description: 'Reversed',
//         title: 'Transaction Reversed',
//         provider: 'n3t',
//         status: 'reversed',
//         type: EVENT_TYPE.reverse_transaction,
//         request_id: `${reqId}_${userId}_${amount}_${network}_${phone}_${dataAmt}_${commission}`,
//         transaction_id: reqId,
//         user: userId,
//         meta_data: JSON.stringify(metadata)
//     })