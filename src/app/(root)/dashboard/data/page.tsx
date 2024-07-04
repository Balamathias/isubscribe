import WidthWrapper from '@/components/WidthWrapper'
import DataTabs from '@/components/dashboard/DataTabs'
import SubDataProvider from '@/providers/data/sub-data-provider'
import React from 'react'

const DataPage = async () => {
  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16'>
      <SubDataProvider>
        <DataTabs />
      </SubDataProvider>
    </WidthWrapper>
  )
}

export default DataPage
