'use client'

import CustomInput from '@/components/CustomInput'
import WidthWrapper from '@/components/WidthWrapper'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordForEmail } from '@/lib/supabase/user.actions'
import { LucideMail } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const ForgotPassword = () => { 
    const [email, setEmail] = useState('')
    const [isPending, setIsPending] = useState(false)
    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsPending(true)
            await resetPasswordForEmail(email)
            toast.success('Success', {description: 'Password reset email sent successfully, Please Check your email.', className: 'border-green-500 border-2 bg-green-200 dark:bg-green-800 '})
            return
        } catch (error) {
            console.error(error)
            setIsPending(false)
            toast.error('Error', {description: 'An error occured, please try again.'})
        } finally {setIsPending(false)}
   }
  return (
    <div className='bg-violet-50/80 dark:bg-background'>
        <WidthWrapper className="min-h-screen items-center justify-center">
            <Card className="flex flex-col p-5 py-6 drop-shadow-md shadow-lg border-none">
                <h1 className="text-3xl text-primary py-2.5">Forgot password</h1>
                <Label className="text-sm py-2" htmlFor='email'>Enter your email address to reset your password.</Label>
                <form className="flex flex-col gap-3" onSubmit={handle}>
                    <CustomInput type="email" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Email address" required id='email' Icon={LucideMail}/>
                    <Button type="submit" disabled={isPending} className='mt-2 w-full bg-gradient-to-l from-pink-500 via-purple-600 to-violet-700 h-12 rounded-lg flex justify-center items-center'>{isPending ? 'Processing...' : 'Reset Password'}</Button>
                </form>
            </Card>
        </WidthWrapper>
    </div>
  )
}

export default ForgotPassword