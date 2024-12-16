import WidthWrapper from '@/components/WidthWrapper'
import SignInComponent from '@/components/auth/SignInComponent'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your isubscribe account',
}

const SignInPage = () => {
  return (
    <WidthWrapper className="min-h-screen">
        <div className='flex flex-col gap-4 items-center justify-center'>
            <SignInComponent />
        </div>
    </WidthWrapper>
  )
}

export default SignInPage