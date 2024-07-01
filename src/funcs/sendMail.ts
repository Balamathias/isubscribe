// 'use server'

import type { EmailTemplateProps } from "@/email/Email";

export const runtime = "edge"

interface Message {
    email: string;
    subject: string;
    message: string;
};

const sendEmail = async (message: Message & EmailTemplateProps) => {
    const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/send-mail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })

    if (res.ok) {
        return await res.json() as {message: string};
    } else {
        console.log(res.statusText)
        return {message: 'Error sending email'}
    }
  };
  
  export default sendEmail;