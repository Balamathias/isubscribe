import WidthWrapper from '@/components/WidthWrapper'
import PassPinForm from '@/components/dashboard/PassPinForm'
import { generateReservedAccount, getUser } from '@/lib/supabase/accounts'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: 'Set Pass Pin',
  description: 'Set your pass pin.'
}

const Page = async () => {

  const [
    { data: user },
    { data: currentUser },
  ] = await Promise.all([
    getUser(),
    getCurrentUser(),
  ])

  if (!currentUser?.user) return redirect('/sign-in')

  await generateReservedAccount()

  if (user?.onboarded) return redirect('/dashboard?step=welcome')
    
  return (
    <WidthWrapper className='min-h-screen flex flex-col items-center justify-center'>
      <PassPinForm />
    </WidthWrapper>
  )
}

export default Page
