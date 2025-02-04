import SubsComponent from '@/components/dashboard/subs/sub-component'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import WidthWrapper from '@/components/WidthWrapper'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Services | isubscribe"
}

const SubsPage = () => {
  return (
    <WidthWrapper className='!max-w-3xl mt-16 md:py-12'>
        <h2 className='text-xl font-semibold py-2 tracking-normal'>Services</h2>

        <Suspense fallback={<ActionBoxSkeleton />}>
          <SubsComponent />
        </Suspense>
    </WidthWrapper>
  )
}

export default SubsPage
