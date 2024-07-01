import { renderEmailHTML } from "@/email/LoginEmail"
import { prepareMail } from "@/utils/prepareMail"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    const { email, password } = await req.json()

    if (!email || !password ) {
        return NextResponse.json({message: 'Invalid request'}, { status: 400 })
    }

    const generateVerificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const { message, status } = await prepareMail({
        email,
        subject: 'Logged in successfully',
        message: 'You have successfully logged in to your account. If you do not know about the new sign in please secure your account. If you have any questions, please contact us at https:support.matiecodes.tech. Visit our Home page at https://matiecodes.tech.',
        html: renderEmailHTML({ 
            email, 
            message: 'You have successfully logged in to your account. If you do not know about the new sign in please secure your account. If you have any questions, please contact us at https:support.matiecodes.tech. Visit our Home page at https://matiecodes.tech.',
        })
    })

    if (status === 201) {
        return NextResponse.json({message: 'Success!'}, { status: 200 })
    }
    
    return NextResponse.json({message: 'An error occurred, please try again'}, { status: 400 })

}
