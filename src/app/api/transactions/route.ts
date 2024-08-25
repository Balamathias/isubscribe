import { TransactionEvent } from "@/types/webhooks"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import sendEmail from "@/utils/sendMail"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export const runtime = 'edge' // No fear, it won't timeout... I am using runtime - Edge

export const POST = async (req: Request, res: Response) => {

    const allowedIPs = ['35.242.133.146'] // Monnify IP
    var ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip')

    if (!allowedIPs.includes(ip!)) {
        return NextResponse.json({message: 'Unauthorized'}, {status: 401})
    }

    const supabase = createClient()
    const data = await req.json() as TransactionEvent

    if (!data) {
        return NextResponse.json({message: 'Invalid data'}, {status: 400})
    }

    const { data: __hist, error: __hist__err } = await supabase
        .from('history')
        .select('transaction_id')
        .eq('transaction_id', data?.eventData?.transactionReference)
        .single()

    if (__hist?.transaction_id) return NextResponse.json({message: 'Transaction already processed.'}, {status: 400}) // Avoid duplicating value if monnify resends a notification that has been processed already.

    
    const { data: user, error } = await supabase
        .from('profile')
        .select(`id, email, wallet(balance)`)
        .eq('email', data.eventData?.customer?.email)
        .single()

    if (error) {
        return NextResponse.json({message: 'Error fetching user'}, {status: 500})
    }

    if (data?.eventType === 'SUCCESSFUL_TRANSACTION') {

        const { data: wallet, error: walletError } = await supabase.from('wallet')
            .select('balance')
            .eq('user', user?.id)
            .single()

        if (walletError) return NextResponse.json({message: 'Getting wallet failed'}, { status: 500})

        const walletBalance = wallet?.balance ?? 0

        const { data: walletUpdate, error: updateWalletError } = await supabase
            .from('wallet')
            .update({
                balance: walletBalance + data.eventData.amountPaid,
                meta_data: JSON.stringify(data?.eventData),
            })
            .eq('user', user.id)

        if (updateWalletError) {
            return NextResponse.json({message: 'Error updating wallet'}, {status: 500})
        }

        const { error: _historyError } = await  supabase.from('history')
        .insert({
            type: EVENT_TYPE.wallet_fund,
            description: `Transferred ${data?.eventData?.amountPaid} successfully to iSubscribe wallet.`,
            updated_at: data?.eventData?.paidOn,
            status: data?.eventData?.paymentStatus,
            title: 'Wallet Fund',
            user: user?.id,
            meta_data: JSON.stringify(data?.eventData),
            amount: data?.eventData?.amountPaid,
            transaction_id: data?.eventData?.transactionReference,
        }).select()

        console.log(_historyError)

        if (_historyError) return NextResponse.json({message: 'Saving History data failed'}, { status: 500 })
            
            const {message} = await sendEmail({
            email: data?.eventData?.customer?.email,
            subject: 'Transfer successful',
            message: 'Your wallet transfer to iSubscribe was successful. Thank you for choosing us.',
        })
        
        return NextResponse.json({message: 'Wallet credited successfully.'}, {
            status: 200,
         })
    } else {
        const { error: _historyError } = await  supabase.from('history')
        .insert({
            type: EVENT_TYPE.wallet_fund_failed,
            description: `Your attempt to fund your wallet was unsuccessful.`,
            status: data?.eventData?.paymentStatus,
            title: 'Wallet Fund Failed',
            user: user?.id,
            meta_data: JSON.stringify(data?.eventData),
            amount: data?.eventData?.amountPaid
        }).select()
        
        console.log(_historyError)
        if (_historyError) return NextResponse.json({message: 'Saving History data failed'}, { status: 500 })
    }

    console.log(data)

}