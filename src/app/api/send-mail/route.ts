import { NextResponse } from "next/server";
import { EmailTemplateProps, renderEmailHTML } from "@/email/Email";
import nodemailer from 'nodemailer'

export const POST = async (req: Request) => {
    const { email, subject, message, title, links, ...rest } = await req.json() as EmailTemplateProps;

    const mailOptions = {
        from: 'isubscribe',
        to: email,
        subject: subject,
        text: message,
        html: renderEmailHTML({ email, title, message, links, ...rest})
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NEXT_GMAIL_USER,
            pass: process.env.NEXT_GMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({message: 'Message delivered'}, {status: 250});
    } catch (error) {
        console.error('Email sending failed:', error);
        return NextResponse.json({message: 'Connection refused'}, {status: 404});
    }
}
