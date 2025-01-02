import { WebhookResponse_N3T } from "@/@types/webhooks"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
    const response: WebhookResponse_N3T = await req.json()

    const supabase = createClient()

    if (response?.status === 'success') {
        const { data: transaction } = await supabase.from('history')
            .select('*')
            .or(`request_id.eq.${response?.["request-id"]},meta_data->transId.eq.${response?.["request-id"]}`)
            .single()

        if (transaction) {
            const { error } = await supabase
                .from('history')
                .update({ status: 'success' })
                .eq('id', transaction.id)

            if (error) {
                console.error("Failed to update transaction status:", error)
                return NextResponse.json({ message: "Internal server error" }, { status: 500 })
            }
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
    
    else if (response?.status === 'failed' || response?.status === 'error') {
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
        }
        
        console.error("Failed transaction:", response)
    }
    
    else {
        console.warn("Unhandled webhook status:", response.status)
    }

    return NextResponse.json({ message: "Success!" }, { status: 200 })
}