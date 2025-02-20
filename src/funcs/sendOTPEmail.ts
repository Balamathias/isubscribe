"use server"

import OTPTemplate from '@/components/templates/otp';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string, name: string) => {
    try {
        const response = await resend.emails.send({
            from: 'isubscribe <no-reply@updates.isubscribe.ng>',
            to: [email],
            subject: 'Your OTP for Pin Reset',
            react: OTPTemplate({ otp, firstName: name?.trim()?.split(' ')?.at(0)! })
        });

        console.log('OTP email sent:', response);
        return response
    } catch (error: any) {
        console.error('Error sending OTP email:', error);
        return { error: error.message }
    }
};
