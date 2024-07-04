import WidthWrapper from '@/components/WidthWrapper'
import DataTabs from '@/components/dashboard/DataTabs'
import React from 'react'

const DataPage = async () => {
  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16'>
      <DataTabs />
    </WidthWrapper>
  )
}

export default DataPage
