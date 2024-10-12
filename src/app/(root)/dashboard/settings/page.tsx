import SettingsComponent from '@/components/dashboard/settings/settings-component'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import React from 'react'

const SettingsPage = async () => {
  const { data: profile } = await getUser()
  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <h2 className='text-lg md:text-xl tracking-tighter'>Settings</h2>

      <SettingsComponent profile={profile!} />
    </WidthWrapper>
  )
}

export default SettingsPage
