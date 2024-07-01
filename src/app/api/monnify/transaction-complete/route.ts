import sendEmail from "@/utils/sendMail"
import { NextResponse } from "next/server"

export const runtime = "edge"

export const POST = async (req: Request, res: Response) => {
    const data = await req.json()

    console.log(data)
    await sendEmail({
        email: 'balamathias40@gmail.com',
        subject: 'Transaction completed',
        message: 'Transaction completed successfully',
        html: `<pre>${JSON.stringify(data ?? [])}</pre>`
    })

    return NextResponse.json({message: 'Transaction completed', data: JSON.stringify(data, null, 2)}, {status: 200, statusText: 'OK'})
}