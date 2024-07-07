import WidthWrapper from '@/components/WidthWrapper'
import HistoryDetail from '@/components/dashboard/history/history-detail'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import { getSingleHistory } from '@/lib/supabase/history'
import React, { Suspense } from 'react'

const HistoryDetailPage = async ({ params }: { params: { id: string } }) => {
  const { data: history } = await getSingleHistory(parseInt(params.id))
  return (
    <WidthWrapper className='mt-16 !max-w-3xl w-full'>
        <Suspense fallback={<ActionBoxSkeleton />}>
            <HistoryDetail history={history} />
        </Suspense>
    </WidthWrapper>
  )
}

export default HistoryDetailPage
