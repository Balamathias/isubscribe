import { renderEmailHTML } from "@/email/ResetPassword"
import { prepareMail } from "@/utils/prepareMail"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({message: 'Invalid request'}, { status: 400 })
    }

    const generateVerificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    // Reset password in db
    const { message, status } = await prepareMail({
        email,
        subject: 'Password Reset successfully',
        message: 'Congratulations! Your password has been reset successfully. You can now sign in with your new password. Return to our Home page at ' + process.env.NEXT_PUBLIC_SITE_URL,
        html: renderEmailHTML({ 
            email, 
            message: 'Congratulations! Your password has been reset successfully. You can now sign in with your new password. Return to our Home page at ' + process.env.NEXT_PUBLIC_SITE_URL,
            link: {href: `${process.env.NEXT_PUBLIC_SITE_URL}?just_reset_password=true`, label: 'Go to Home page'}
        })
    })

    if (status === 201) {
        return NextResponse.json({message: 'Success!'}, { status: 200 })
    }
    
    return NextResponse.json({message: 'An error occurred, please try again'}, { status: 400 })

}
