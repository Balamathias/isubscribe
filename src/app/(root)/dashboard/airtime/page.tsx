import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import SubDataProvider from '@/providers/data/sub-data-provider'
import React from 'react'

const AirtimePage = async () => {
  const { data: profile } = await getUser()

  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <SubDataProvider action='airtime' profile={profile!}>
        <h2 className='text-primary text-lg'>Airtime</h2>
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default AirtimePage
