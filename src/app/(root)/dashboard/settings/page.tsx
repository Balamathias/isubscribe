import SettingsComponent from '@/components/dashboard/settings/settings-component'
import { ModeToggle } from '@/components/mode-toggle'
import WidthWrapper from '@/components/WidthWrapper'
import React from 'react'

const SettingsPage = () => {
  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <h2 className='text-lg md:text-xl tracking-tighter'>Settings</h2>

      <SettingsComponent />
    </WidthWrapper>
  )
}

export default SettingsPage
