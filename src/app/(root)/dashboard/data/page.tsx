import WidthWrapper from '@/components/WidthWrapper'
import DataTabs from '@/components/dashboard/data/DataTabs'
import SubDataProvider from '@/providers/data/sub-data-provider'
import { Metadata } from 'next'
import React from 'react'

import { getUser } from '@/lib/supabase/accounts'
export const metadata: Metadata = {
  title: 'Buy Data | isubscribe',
  description: 'Buy data from your favourite network provider with ease. Get started today with isubscribe!',
}

const DataPage = async () => {
  const { data: profile } = await getUser()
  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <SubDataProvider>
        <DataTabs profile={profile} />
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default DataPage
