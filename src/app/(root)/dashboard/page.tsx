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

const DashboardPage = async ({searchParams}: { searchParams: {[key: string]: string} }) => {
    const { data: profile } = await getUser()
    const { data: wallet } = await getWallet(profile?.id!)

  return (
    <WidthWrapper className='flex flex-col space-y-4 !max-w-3xl md:py-12 mt-16'>

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
