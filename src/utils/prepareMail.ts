'use server'

const nodemailer = require('nodemailer');

interface Props {
    email: string, 
    subject: string, 
    message: string,
    html: string,
}

export const prepareMail = async ({email, subject, message, html }: Props) => {
    const mailOptions = {
        from: 'matiecodes.tech',
        name: 'MatieCodes',
        to: email,
        subject: subject,
        text: message,
        html: html
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        tls: 'SSLv3',
        auth: {
            user: process.env.NEXT_GMAIL_USER,
            pass: process.env.NEXT_GMAIL_PASS,
        },
    })

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err: any, info: any) => {
        
            if (err) {
              return {message: 'Connection refused', status: 404}
            } 
            resolve(info)
        })
    })

    return {message: 'Success', status: 201}
}