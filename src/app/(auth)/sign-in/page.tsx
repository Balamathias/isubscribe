import WidthWrapper from '@/components/WidthWrapper'
import SignInComponent from '@/components/auth/SignInComponent'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: 'Sign In | Log In',
    description: 'Log in to your isubscribe account to start making payments now!',
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