import WidthWrapper from '@/components/WidthWrapper'
import PassPinForm from '@/components/dashboard/PassPinForm'
import { generateReservedAccount, getUser } from '@/lib/supabase/accounts'
import { createReferral } from '@/lib/supabase/share'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { REFERRAL_BONUS } from '@/types/constants'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: 'Set Pass Pin',
  description: 'Set your pass pin.'
}

const Page = async ({ searchParams: { referral } }: { searchParams: { referral?: string }}) => {

  let referralErrorMessage = ''

  const [
    { data: user },
    { data: currentUser },
  ] = await Promise.all([
    getUser(),
    getCurrentUser(),
  ])

  if (!currentUser?.user) return redirect('/sign-in')

  try {
    await generateReservedAccount()
  } catch (error) {
    console.log("ACCTSERROR: ", error)
  }

  if (user?.onboarded) return redirect('/dashboard')
  
  if (user && !user?.onboarded) {
    if (referral) {
      const { error } = await createReferral({referrer: referral , referred: user?.id, status: 'pending', reward: REFERRAL_BONUS })

      if (error)
        referralErrorMessage = error
    }
  }
    
  return (
    <WidthWrapper className='min-h-screen flex flex-col items-center justify-center'>
      <PassPinForm referralErrorMessage={referralErrorMessage} />
    </WidthWrapper>
  )
}

export default Page
