import WidthWrapper from '@/components/WidthWrapper'
import ActionBox from '@/components/dashboard/ActionBox'
import Announcements from '@/components/dashboard/Announcements'
import QuickActions from '@/components/dashboard/QuickActions'
import WelcomeBonusModal from '@/components/dashboard/WelcomeBonus'
import WelcomeModal from '@/components/dashboard/WelcomeModal'
import { getUser } from '@/lib/supabase/accounts'
import { getWallet } from '@/lib/supabase/wallets'
import React from 'react'

const DashboardPage = async ({searchParams}: { searchParams: {[key: string]: string} }) => {
    const [
      { data: profile },
      { data: wallet }
    ] = await Promise.all([
      getUser(),
      getWallet()
    ])

    const sP = new URLSearchParams(searchParams)
    // const action = sP.get('action')
    const step = sP.get('step')

  return (
    <WidthWrapper className='flex flex-col space-y-4 max-w-3xl md:py-12 mt-16'>

      <ActionBox />
      <QuickActions />
      <Announcements />

      <WelcomeBonusModal profile={profile!} wallet={wallet!} />

      {
        step === 'welcome' && <WelcomeModal step={step} profile={profile!} />
      }
    </WidthWrapper>
  )
}

export default DashboardPage
