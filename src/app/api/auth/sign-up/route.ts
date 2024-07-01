import { renderEmailHTML } from "@/email/VerifyEmail"
import { prepareMail } from "@/utils/prepareMail"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    const { email, password, username } = await req.json()

    if (!email || !password || !username) {
        return NextResponse.json({message: 'Invalid request'}, { status: 400 })
    }

    const generateVerificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const constructVerifyEmailURL = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email?token=${generateVerificationToken}&email=${email}`

    const { message, status } = await prepareMail({
        email,
        subject: 'Verify your email',
        message: 'Please verify your email by clicking the link below',
        html: renderEmailHTML({ 
            email, 
            username, 
            message: 'Thank you for signing up, please verify your email by clicking the link below.',
            link: {label: 'Verify Email', href: constructVerifyEmailURL}})
    })

    if (status === 201) {
        return NextResponse.json({message: 'We have sent you a verification email, please check your email to verify your account'}, { status: 201 })
    }
    
    return NextResponse.json({message: 'An error occurred, please try again'}, { status: 400 })

}
