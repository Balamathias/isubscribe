import WidthWrapper from '@/components/WidthWrapper'
import OtpForm from '@/components/auth/OtpForm'
import {  getUser } from '@/lib/supabase/accounts'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify Your OTP.'
}

const Page = async () => {

  const [
    { data: user },
    { data: currentUser },
  ] = await Promise.all([
    getUser(),
    getCurrentUser(),
  ])

    console.log("CurrentUser", currentUser)
    console.log("User", user)

  

  // if (user?.onboarded) return redirect('/dashboard')
    
  return (
    <WidthWrapper className='min-h-screen flex flex-col items-center justify-center'>
      <OtpForm user={currentUser?.user_metadata}  />
    </WidthWrapper>
  )
}

export default Page
