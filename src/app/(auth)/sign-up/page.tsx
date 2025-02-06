import WidthWrapper from '@/components/WidthWrapper'
import SignUpComponent from '@/components/auth/SignUpComponent'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign up | Create Your Account',
  description: 'Sign up today on isubscribe to get started with Bill Payments, it is easy and simple on isubscribe.',
  openGraph: {
    images: ['/opengraph/og-2.jpeg', '/opengraph/og-4.jpeg',  '/opengraph/og-1.jpeg'],
  }
}

const SignUpPage = () => {
  return (
    <WidthWrapper className="min-h-screen">
        <div className='flex flex-col items-center justify-center gap-4 w-full mx-auto'>
            <SignUpComponent />
        </div>
    </WidthWrapper>
  )
}

export default SignUpPage