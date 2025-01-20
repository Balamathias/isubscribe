import WidthWrapper from '@/components/WidthWrapper'
import DataTabs from '@/components/dashboard/data/DataTabs'
import SubDataProvider from '@/providers/data/sub-data-provider'
import { Metadata } from 'next'
import React from 'react'

import { getUser } from '@/lib/supabase/accounts'
import { getWallet } from '@/lib/supabase/wallets'

export const runtime = 'edge'


export const metadata: Metadata = {
  title: 'Buy Data | isubscribe',
  description: 'Buy data from your favourite network provider with ease. Get started today with isubscribe... DO this in a few clicks!',
}

const DataPage = async () => {
  const [{ data: profile }, { data: wallet }] = await Promise.all([getUser(), getWallet()])
  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <SubDataProvider profile={profile!} wallet={wallet}>
        <DataTabs profile={profile} />
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default DataPage
