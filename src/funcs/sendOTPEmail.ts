import OTPTemplate from '@/components/templates/otp';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string, firstName: string) => {
    try {
        const response = await resend.emails.send({
            from: 'isubscribe <onboarding@resend.dev>',
            to: ['balamathias05@gmail.com'],
            subject: 'Your OTP for Pin Reset',
            react: OTPTemplate({ otp, firstName })
        });

        console.log('OTP email sent:', response);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};
