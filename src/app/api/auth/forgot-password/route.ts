import { renderEmailHTML } from "@/email/ResetPassword"
import { prepareMail } from "@/utils/prepareMail"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({message: 'Invalid request'}, { status: 400 })
    }

    const generateVerificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const { message, status } = await prepareMail({
        email,
        subject: 'Reset your password',
        message: 'Your reset password link is here. Click on the link to reset your password. If you have any questions, please contact us at https:support.matiecodes.tech. Visit our Home page at https://matiecodes.tech.',
        html: renderEmailHTML({ 
            email, 
            message: 'Your reset password link is here. Click on the link to reset your password. If you have any questions, please contact us at https:support.matiecodes.tech. Visit our Home page at https://matiecodes.tech.',
            link: {href: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?email=${email}&token=${generateVerificationToken}`, label: 'Reset my password'}
        })
    })

    if (status === 201) {
        return NextResponse.json({message: 'Success!'}, { status: 200 })
    }
    
    return NextResponse.json({message: 'An error occurred, please try again'}, { status: 400 })

}
