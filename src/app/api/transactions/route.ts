import { NextResponse } from "next/server"

export const POST = async (req:Request, res:Response) => {
    const data = await req.json()

    // TODO: Validate data
    // if (!data) {
    //     return NextResponse.json({message: 'Invalid data'}, {status: 400})
    // }

    // Call Supabase and credit wallet
    // const { data: user, error } = await supabase
    //     .from('users')
    //     .select('id, wallet')
    //     .eq('email', data.email)

    // if (error) {
    //     return NextResponse.json({message: 'Error fetching user'}, {status: 500})
    // }

    // const walletBalance = user.wallet.balance

    // const { data: walletUpdate, error } = await supabase
    //     .from('wallets')
    //     .update({
    //         balance: walletBalance + data.amount
    //     })
    //     .eq('user', user.id)

    // if (error) {
    //     return NextResponse.json({message: 'Error updating wallet'}, {status: 500})
    // }

    // TODO: Send email with Nodemailer

    return NextResponse.json({message: 'Wallet credited'}, {status: 200})
}