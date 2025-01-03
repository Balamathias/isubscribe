import AirtimeContent from '@/components/dashboard/airtime/airtime-content'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import SubDataProvider from '@/providers/data/sub-data-provider'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Airtime | isubscribe',
  description: 'Buy airtime from your favourite network provider with ease. Get started today with isubscribe! Airtime purchase on isubscribe just got easier... Grab it without a waste of time.',
}

const AirtimePage = async () => {
  const { data: profile } = await getUser()

  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <SubDataProvider action='airtime' profile={profile!}>
        <h2 className='text-lg font-semibold py-3'>Buy Airtime</h2>
        <AirtimeContent />
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default AirtimePage
