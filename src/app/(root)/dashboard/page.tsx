import WidthWrapper from '@/components/WidthWrapper'
import ActionBox from '@/components/dashboard/ActionBox'
import Announcements from '@/components/dashboard/Announcements'
import QuickActions from '@/components/dashboard/QuickActions'
import MoreActions, { MoreActionsSkeleton } from '@/components/dashboard/more-actions'
import RecentTransactions from '@/components/dashboard/recent-transactions'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import React, { Suspense } from 'react'

import { Metadata } from 'next'
import DashFooter from '@/components/dashboard/dash-footer'
import Greeting, { GreetingSkeleton } from '@/components/dashboard/greeting'

export const metadata: Metadata = {
  title: "isubscribe | dashboard ~ start paying your utility bills with ease.",
  description: "isubscribe is a subscription-based platform that allows you to pay for your utility bills with ease. Get started today!",
}

const DashboardPage = () => {
  return (
    <WidthWrapper className='flex flex-col space-y-2.5 sm:space-y-4 !max-w-3xl md:py-12 mt-16 max-sm:mt-8'>

      <Suspense fallback={<GreetingSkeleton />}>
        <Greeting />
      </Suspense>

      <div className='flex flex-col space-y-4'>
        <ActionBox />
        <QuickActions />

        <Suspense fallback={<ActionBoxSkeleton isHome/>}>
          <RecentTransactions />
        </Suspense>

        <Suspense fallback={<MoreActionsSkeleton />}>
          <MoreActions />
        </Suspense>

        <Announcements />

        <DashFooter />
      </div>
    </WidthWrapper>
  )
}

export default DashboardPage
