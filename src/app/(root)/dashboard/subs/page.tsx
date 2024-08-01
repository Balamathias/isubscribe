import SubsComponent from '@/components/dashboard/subs/sub-component'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import WidthWrapper from '@/components/WidthWrapper'
import React, { Suspense } from 'react'

const SubsPage = () => {
  return (
    <WidthWrapper className='!max-w-3xl mt-16 md:py-12'>
        <h2 className='text-xl text-center font-semibold py-2 px-3 tracking-tighter rounded-full bg-violet-600/5 text-violet-600'>Quick Subs</h2>

        <Suspense fallback={<ActionBoxSkeleton />}>
          <SubsComponent />
        </Suspense>
    </WidthWrapper>
  )
}

export default SubsPage
