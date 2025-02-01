import TransferComponent from '@/components/dashboard/transfer/transfer-component'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import WidthWrapper from '@/components/WidthWrapper'
import { getWallet } from '@/lib/supabase/wallets'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Send money | isubscribe"
}

const TransferPage = async () => {
  const { data: wallet } = await getWallet()
  return (
    <WidthWrapper className='!max-w-3xl mt-16 md:py-12'>
        <h2 className='text-xl font-semibold py-2 tracking-normal'>Transfer Money</h2>

        <Suspense fallback={<ActionBoxSkeleton />}>
          <TransferComponent wallet={wallet!}/>
        </Suspense>
    </WidthWrapper>
  )
}

export default TransferPage
