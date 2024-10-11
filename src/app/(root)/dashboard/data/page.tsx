import WidthWrapper from '@/components/WidthWrapper'
import DataTabs from '@/components/dashboard/data/DataTabs'
import SubDataProvider from '@/providers/data/sub-data-provider'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Buy Data | isubscribe'
}

const DataPage = async () => {

  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <SubDataProvider>
        <DataTabs />
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default DataPage
