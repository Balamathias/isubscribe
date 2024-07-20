import WidthWrapper from '@/components/WidthWrapper'
import FundWalletBox from '@/components/dashboard/FundWalletBox'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import { Metadata } from 'next'
import React, { Suspense } from 'react'
import FTabs from './tabs'

export const metadata: Metadata = {
    title: 'Fund Wallet',
    description: 'Fund your wallet to start subscribing to your favorite plan'

}

const FundWalletPage = () => {
  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16'>
      <div className='flex flex-col space-y-4'>
        <h1 className='text-2xl font-semibold tracking-tight text-muted-foreground'>Add money</h1>
        
        <Suspense fallback={<ActionBoxSkeleton />}>
            <FTabs />
        </Suspense>
      </div>
    </WidthWrapper>
  )
}

export default FundWalletPage
