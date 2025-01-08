import WidthWrapper from '@/components/WidthWrapper'
import { LucideCheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const VerificationEmailSentPage = () => {
  return (
    <WidthWrapper className="h-full min-h-screen items-center justify-center">
        <div className='flex flex-col gap-4'>
            <div className='text-center p-6 lg:px-10 rounded-xl flex flex-col shadow-none drop-shadow-none gap-3 items-center justify-center'>
                <LucideCheckCircle2 size={24} className='text-green-600/90 w-16 h-16 mx-auto' />
                <h1 className='text-lg md:text-xl py-2'>Password Reset Successfully</h1>
                <p className="text-base py-2 text-muted-foreground leading-6">
                    Your password has been reset successfully, you can now sign in with your new password.
                    {' '}
                    <Link href="/" className="underline text-primary dark:text-violet-400">Return Home | Dashboard</Link>
                </p>
            </div>
        </div>
    </WidthWrapper>
  )
}

export default VerificationEmailSentPage