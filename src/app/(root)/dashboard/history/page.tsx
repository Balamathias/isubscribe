import WidthWrapper from '@/components/WidthWrapper'
import HistoryTabs from '@/components/dashboard/HistoryTabs'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'History',
    description: 'Your Transaction History'

}

const HistoryPage = () => {
  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16 overflow-hidden w-full'>
      <div className='flex flex-col space-y-4 w-full'>
        <h1 className='text-2xl font-bold'>Your Transaction History</h1>
        
        <Suspense fallback={<ActionBoxSkeleton />}>
            <HistoryTabs />
        </Suspense>
      </div>
    </WidthWrapper>
  )
}

export default HistoryPage
