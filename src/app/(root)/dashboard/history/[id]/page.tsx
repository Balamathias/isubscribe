import WidthWrapper from '@/components/WidthWrapper'
import HistoryDetail from '@/components/dashboard/history/history-detail'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import React, { Suspense } from 'react'

const HistoryDetailPage = async ({ params }: { params: { id: string } }) => {
  
  return (
    <WidthWrapper className='mt-16 !max-w-3xl w-full'>
        <Suspense fallback={<ActionBoxSkeleton />}>
            <HistoryDetail historyId={params.id} />
        </Suspense>
    </WidthWrapper>
  )
}

export default HistoryDetailPage
