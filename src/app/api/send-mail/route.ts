import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { EmailTemplateProps, renderEmailHTML } from "@/email/Email";

const nodemailer = require('nodemailer');

export const POST = async (req: Request) => {
    const { email, subject, message, title, links, ...rest } = await req.json() as EmailTemplateProps;

    const mailOptions = {
        from: 'matiecodes.tech',
        to: email,
        subject: subject,
        text: message,
        html: renderEmailHTML({ email, title, message, links, ...rest})
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NEXT_GMAIL_USER,
            pass: process.env.NEXT_GMAIL_PASS,
        },
    })

    transporter.sendMail(mailOptions, (err: any, info: any) => {
        
        if (err) {
          return NextResponse.json({message: 'Connection refused'}, {status: 404})
        } 
    })
    
    return NextResponse.json({message: 'Message delivered'}, {status: 250})
}
