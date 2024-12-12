import Empty from '@/components/Empty'
import WidthWrapper from '@/components/WidthWrapper'
import HistoryTabs from '@/components/dashboard/history/HistoryTabs'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { HistoryIcon } from 'lucide-react'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Transaction History',
    description: 'Transaction History | Isubscribe'

}

const HistoryPage = async () => {

  const { data: { user } } = await getCurrentUser()

  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16 overflow-hidden w-full'>
      {
        user ? (
          <div className='flex flex-col space-y-4 w-full'>
            <h1 className='md:text-2xl text-lg tracking-tighter font-bold'>Transaction History</h1>
            
            <Suspense fallback={<ActionBoxSkeleton isHome/>}>
                <HistoryTabs />
            </Suspense>
          </div>
        ): (
          <Empty 
            title='No Transactions'
            content='Please sign in to view your transaction history.'
            icon={<HistoryIcon />}
            color='gray'
          />
        )
      }
    </WidthWrapper>
  )
}

export default HistoryPage
