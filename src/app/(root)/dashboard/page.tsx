import WidthWrapper from '@/components/WidthWrapper'
import ActionBox from '@/components/dashboard/ActionBox'
import Announcements from '@/components/dashboard/Announcements'
import QuickActions from '@/components/dashboard/QuickActions'
import WelcomeBonusModal from '@/components/dashboard/WelcomeBonus'
import RecentTransactions from '@/components/dashboard/recent-transactions'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import { getUser } from '@/lib/supabase/accounts'
import { getWallet } from '@/lib/supabase/wallets'
import React, { Suspense } from 'react'

const DashboardPage = async ({}: { searchParams: {[key: string]: string} }) => {
    const [{ data: profile }, { data: wallet }] = await Promise.all([
      getUser(),
      getWallet()
    ])

  return (
    <WidthWrapper className='flex flex-col space-y-2.5 sm:space-y-4 !max-w-3xl md:py-12 mt-16 max-sm:mt-8'>

      <div className='flex flex-col space-y-1 md:hidden'>
        <h2 className='text-muted-foreground text-lg'>Hi, <span className="font-semibold dark:text-amber-500/90">{profile?.full_name?.split(' ')?.at(0)}</span>,</h2>
        <p className='text-muted-foreground text-xs'>What would you like to subscribe today?</p>
      </div>

      <div className='flex flex-col space-y-4'>
        <ActionBox />
        <QuickActions />

        <Suspense fallback={<ActionBoxSkeleton isHome/>}>
          <RecentTransactions />
        </Suspense>

        <Announcements />
        
        <Suspense fallback={<ActionBoxSkeleton />}>
          <WelcomeBonusModal profile={profile!} wallet={wallet!} />
        </Suspense>
      </div>
    </WidthWrapper>
  )
}

export default DashboardPage
