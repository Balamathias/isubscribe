import WidthWrapper from '@/components/WidthWrapper'
import SignInComponent from '@/components/auth/SignInComponent'
import { service } from '@/lib/vtu'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account',
}

const SignInPage = async () => {
  return (
    <WidthWrapper className="min-h-screen">
        <div className='flex flex-col gap-4 items-center justify-center'>
            <SignInComponent />
        </div>
    </WidthWrapper>
  )
}

export default SignInPage