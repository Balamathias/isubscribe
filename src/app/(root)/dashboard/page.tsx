import WidthWrapper from '@/components/WidthWrapper'
import ActionBox from '@/components/dashboard/ActionBox'
import Announcements from '@/components/dashboard/Announcements'
import QuickActions from '@/components/dashboard/QuickActions'
import WelcomeBonusModal from '@/components/dashboard/WelcomeBonus'
import WelcomeModal from '@/components/dashboard/WelcomeModal'
import RecentTransactions from '@/components/dashboard/recent-transactions'
import ActionBoxSkeleton from '@/components/skeletons/ActionBoxSkeleton'
import { getUser } from '@/lib/supabase/accounts'
import { getWallet } from '@/lib/supabase/wallets'
import React, { Suspense } from 'react'

const DashboardPage = async ({}: { searchParams: {[key: string]: string} }) => {
    const { data: profile } = await getUser()
    const { data: wallet } = await getWallet(profile?.id!)

  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16'>

      <div className='flex flex-col space-y-1 md:hidden'>
        <h2 className='text-muted-foreground text-lg'>Hi, <span className="font-semibold dark:text-amber-500/90">{profile?.full_name}</span>.</h2>
        <p className='text-muted-foreground text-xs'>What do you wish to do today?</p>
      </div>

      <ActionBox />
      <QuickActions />

      <Suspense fallback={<ActionBoxSkeleton />}>
        <RecentTransactions />
      </Suspense>

      <Announcements />
      
      <Suspense fallback={<ActionBoxSkeleton />}>
        <WelcomeBonusModal profile={profile!} wallet={wallet!} />
      </Suspense>
    </WidthWrapper>
  )
}

export default DashboardPage
