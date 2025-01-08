'use client'

import CustomInput from '@/components/CustomInput'
import WidthWrapper from '@/components/WidthWrapper'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { resetPasswordForEmail } from '@/lib/supabase/user.actions'
import { LucideMail } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import DynamicModal from '@/components/DynamicModal'
import ResetPasswordOTPInput from '@/components/auth/reset-password-otp-form'
import { useValidateResetPassword } from '@/lib/react-query/funcs/user'

const ForgotPassword = () => { 
    const [email, setEmail] = useState('')
    const [isPending, setIsPending] = useState(false)

    const [token, setToken] = useState('')
    const [openVerifyToken, setOpenVerifyToken] = useState(false)


    const { mutate: validateToken, isPending: validating } = useValidateResetPassword()

    const handleVerifyToken = () => {
        validateToken({token, email})
    }

    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsPending(true)
            await resetPasswordForEmail(email)
            toast.success('Success', {description: 'Password reset email sent successfully, Please Check your email.', className: 'border-green-500 border-2 bg-green-200 dark:bg-green-800 '})
            return setOpenVerifyToken(true)
        } catch (error) {
            console.error(error)
            setIsPending(false)
            toast.error('Error', {description: 'An error occured, please try again.'})
        } finally {
            setIsPending(false)
        }
    }

  return (
    <div className='bg-violet-50/80 dark:bg-background/70'>
        <WidthWrapper className="min-h-screen items-center justify-center">
            <Card className="flex flex-col p-5 py-6 shadow-none border-none w-full md:max-w-[500px]">
                <h1 className="text-xl md:text-2xl py-2.5">Forgot password</h1>
                <Label className="text-sm py-2" htmlFor='email'>Enter your email address to reset your password.</Label>
                <form className="flex flex-col gap-3" onSubmit={handle}>
                    <CustomInput type="email" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Email address" required id='email' Icon={LucideMail}/>
                    <Button 
                        type="submit" 
                        disabled={isPending}
                        className='mt-2 w-full rounded-lg bg-gradient-to-tr from-violet-600 to-pink-600 text-white' 
                        size={'lg'}>{isPending ? 'Processing...' : 'Reset Password'}</Button>
                </form>
            </Card>
        </WidthWrapper>

        <DynamicModal
            title="Verify Reset Password OTP"
            open={openVerifyToken}
        >
            <div className='flex flex-col gap-y-4 p-3 w-full items-center justify-center'>
                <ResetPasswordOTPInput 
                    onChange={otp => setToken(otp)}
                />


                <Button
                    onClick={handleVerifyToken}
                    className='w-full rounded-full bg-gradient-to-r from-violet-600 to-pink-600 mt-4'
                    disabled={validating}
                >
                    {validating ? 'Verifying...' : 'Verify'}
                </Button>

                <form className="flex w-full" onSubmit={handle}>
                    <Button
                        className='w-full rounded-full bg-gradient-to-r from-secondary to-card'
                        disabled={isPending || validating}
                        variant={'secondary'}
                    >
                        {isPending ? 'Resending' : 'Resend'}
                    </Button>
                </form>
            </div>
        </DynamicModal>
    </div>
  )
}

export default ForgotPassword