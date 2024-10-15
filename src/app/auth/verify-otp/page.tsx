import WidthWrapper from '@/components/WidthWrapper'
import OtpForm from '@/components/auth/OtpForm'
import {  getUser } from '@/lib/supabase/accounts'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify Your email.'
}

const Page = async ({}: { searchParams: Record<string, string> }) => {
  const [
    { data: user },
  ] = await Promise.all([
    getUser(),
  ]) 

  if (user?.onboarded) return redirect('/dashboard')
    
  return (
    <WidthWrapper className='min-h-screen flex flex-col items-center justify-center'>
      <OtpForm />
    </WidthWrapper>
  )
}

export default Page
