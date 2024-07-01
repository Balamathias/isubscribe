import WidthWrapper from '@/components/WidthWrapper'
import { LucideLock } from 'lucide-react'
import React from 'react'

const SecureAccountPage = ({searchParams}: {searchParams: {[key: string]: string}}) => {
    const urlParams = new URLSearchParams(searchParams)
    const email = urlParams.get('email')
  return (
    <WidthWrapper>
        <div className='flex flex-col gap-4 h-full min-h-screen items-center justify-center'>
            <LucideLock size={32} className='text-green-500 w-20 h-20 mx-auto' />
            <h1 className='text-3xl font-semibold text-primary'>Secure your account</h1>
            <p className='text-center'>Do not be feared bro, your account: <span className='font-bold'>{email}</span> is secured by the grace of God.</p>
        </div>
    </WidthWrapper>
  )
}

export default SecureAccountPage