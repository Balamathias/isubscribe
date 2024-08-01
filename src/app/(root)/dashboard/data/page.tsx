import WidthWrapper from '@/components/WidthWrapper'
import DataTabs from '@/components/dashboard/data/DataTabs'
import { getUser } from '@/lib/supabase/accounts'
import { buyData, getServiceVariations, getVTPassBalance } from '@/lib/vtpass/services'
import SubDataProvider from '@/providers/data/sub-data-provider'
import React from 'react'
import { nanoid } from 'nanoid'

const DataPage = async () => {
  const { data: profile } = await getUser()

  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <title>Buy Data</title>
      <SubDataProvider profile={profile!}>
        <DataTabs />
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default DataPage
