"use client";
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resendOtp, verifyOtp } from '@/lib/supabase/verify-otp';
import { toast } from 'sonner';

const OtpForm = () => {
    const user = JSON.parse(localStorage?.getItem("userReg") || "{}");

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null); // State to track focused input

    const router = useRouter();

    const payload = {
        email: user?.email,
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
            toast.success(`OTP has been Resent To your Email, ${user?.email}`);
        } catch (err) {
            setError("An unexpected error occurred, verify your details");
        } finally {
            setResending(false);
        }
    };

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus on the next input
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput && value !== "") {
            nextInput.focus();
        }
    };

    const handleKeyDown = (e, index) => {
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

    const handleKeypadClick = (value) => {
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

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
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
                        type="text"
                        name="otp"
                        maxLength="1"
                        value={data}
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onFocus={() => setFocusedIndex(index)} // Set focused index
                        onBlur={() => setFocusedIndex(null)} // Clear focused index on blur
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={`w-9 h-9 text-center text-2xl p-2 border-2 rounded-lg focus:outline-none ${focusedIndex === index ? 'border-violet-500' : 'border-gray-300'}`}
                        style={{ color: 'transparent', textShadow: '0 0 0 violet' }}
                    />
                ))}
            </div>
            {error && <p className='text-red-500 text-center'>{error}</p>}
            {success && <p className='text-green-500 text-center'>OTP Verified Successfully!</p>}
            <div className="grid grid-cols-3 gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(number => (
                    <button
                        key={number}
                        onClick={() => handleKeypadClick(number.toString())}
                        className="w-full h-12 text-2xl p-2 border-2 border-gray-300 rounded-lg focus:outline-none bg-gray-100 hover:bg-gray-200"
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={handleClear}
                    className="col-span-2 w-full h-12 text-2xl p-2 border-2 border-gray-300 rounded-lg focus:outline-none bg-gray-100 hover:bg-gray-200"
                >
                    Clear
                </button>
            </div>
            <Button onClick={handleVerifyOtp} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button onClick={handleResendOtp} disabled={resending} className='bg-red-500 hover:bg-red-600'>
                {resending ? 'Resending..' : 'Resend OTP'}
            </Button>
        </div>
    );
};

export default OtpForm;
