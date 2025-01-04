'use client'

import { sendResetPasswordEmail } from "@/components/templates/send-reset-password";
import { sendSignupToken } from "@/components/templates/send-signup-token";

export default function Page() {
    return (
        <div>
            <div 
                dangerouslySetInnerHTML={{__html: sendSignupToken({name: "Matie", site_url: "", token: "123456"})}}
            />
        </div>
    )
}