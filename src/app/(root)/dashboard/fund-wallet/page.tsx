import WidthWrapper from '@/components/WidthWrapper'
import FundWalletBox from '@/components/dashboard/FundWalletBox'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import React, { Suspense } from 'react'

const FundWalletPage = () => {
  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16'>
      <div className='flex flex-col space-y-4'>
        <h1 className='text-2xl font-bold'>Fund Wallet</h1>
        
        <Suspense fallback={<ActionBoxSkeleton />}>
            <FundWalletBox />
        </Suspense>
      </div>
    </WidthWrapper>
  )
}

export default FundWalletPage
