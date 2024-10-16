import Empty from '@/components/Empty'
import WidthWrapper from '@/components/WidthWrapper'
import HistoryDetail from '@/components/dashboard/history/history-detail'
import HistoryDetailSkeletopn from '@/components/skeletons/history.detail.skeleton'
import { getSingleHistory } from '@/lib/supabase/history'
import React, { Suspense } from 'react'

const HistoryDetailPage = async ({ params }: { params: { id: string } }) => {
  const { data: history, error } = await getSingleHistory(parseInt(params.id))

  if (error || !history){
    return (
      <WidthWrapper className='mt-16 !max-w-3xl w-full'>
          <Empty
            title='History not found.'
            content="History could not be loaded at this time."
          />
      </WidthWrapper>
    )
  }

  return (
    <WidthWrapper className='mt-16 !max-w-3xl w-full'>
        <Suspense fallback={<HistoryDetailSkeletopn />}>
            <HistoryDetail history={history} />
        </Suspense>
    </WidthWrapper>
  )
}

export default HistoryDetailPage
