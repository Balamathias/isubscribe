"use client";
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resendOtp, verifyOtp } from '@/lib/supabase/verify-otp';
import { toast } from 'sonner';
import Status from '../status';

const OtpForm = () => {
    const user = JSON.parse(localStorage?.getItem("userReg") || "{}");
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // State to track focused input

    const router = useRouter();

    const payload = {
        email: email,
        otp: otp.join(""),
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { data, error } = await verifyOtp(payload);
            if (error) {
                setError(error || "An error occurred");
            } else {
                setSuccess(true);
                router?.push("/auth/pass-pin");
            }
        } catch (err) {
            setError("An unexpected error occurred, verify your details");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        setError('');

        try {
            const { data, error } = await resendOtp(payload);
            if (error) {
                setError(error || "An error occurred");
            }
            toast.success(`OTP has been Resent To your Email, ${email}`);
        } catch (err) {
            setError("An unexpected error occurred, verify your details");
        } finally {
            setResending(false);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (isNaN(parseInt(value))) return toast.warning('OTP Values must be numbers!');

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus on the next input
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput && value !== "") {
            nextInput.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);

            // Focus on the previous input
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleKeypadClick = (value: string) => {
        const nextIndex = otp.findIndex(digit => digit === "");
        if (nextIndex !== -1) {
            handleChange(nextIndex, value);
        }
    };

    const handleClear = () => {
        setOtp(new Array(6).fill(""));
    };

    const handleCancel = () => {
        setOtp(new Array(6).fill(""));
        setError('');
        setSuccess(false);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text').trim();
        if (isNaN(parseInt(paste))) return toast.warning('OTP Values must be numbers!');

        const newOtp = [...otp];
        paste.split('').forEach((char, index) => {
            if (index < 6) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
    };

    return (
        <div className='flex flex-col gap-3 max-sm:w-[96vw] md:w-[400px] shadow-md p-3 rounded-md'>
            <h1 className='text-center text-l font-[600px]'>Enter the OTP sent to your email below</h1>
            <div className="flex justify-center mb-3 space-x-2">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type='text'
                        maxLength={1}
                        value={data}
                        autoComplete='off'
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onFocus={() => setFocusedIndex(index)} // Set focused index
                        onBlur={() => setFocusedIndex(null)} // Clear focused index on blur
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={`w-9 h-9 text-center text-2xl p-2 border-2 rounded-lg focus:outline-none ${focusedIndex === index ? 'border-violet-500' : 'border-secondary'}`}
                        style={{ color: 'transparent', textShadow: '0 0 0 violet' }}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-y-3">
                {error && <Status status='failed' message={error} />}
                {success && <Status status='success' message={'OTP Verified Successfully! You will be redirected in a bit.'} />}   
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(number => (
                    <Button
                        key={number}
                        onClick={() => handleKeypadClick(number.toString())}
                        className="w-full h-12 text-2xl border-2 dark:border-none rounded-lg bg-secondary/30"
                        variant={'secondary'}
                    >
                        {number}
                    </Button>
                ))}
                <Button
                    onClick={handleClear}
                    className="w-full h-12 text-2xl border-2 dark:border-none rounded-lg col-span-2 bg-red-700/20 text-red-600"
                    variant={'secondary'}
                >
                    Clear
                </Button>
            </div>
            <Button onClick={handleVerifyOtp} disabled={loading} className='rounded-lg h-12 bg-primary/20 text-violet-600'>
                {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button variant={'secondary'} onClick={handleResendOtp} disabled={resending} className='bg-green-700/20 hover:opacity-70 text-green-600 rounded-lg h-12'>
                {resending ? 'Resending..' : 'Resend OTP'}
            </Button>
        </div>
    );
};

export default OtpForm;
