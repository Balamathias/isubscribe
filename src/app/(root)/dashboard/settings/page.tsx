import { ModeToggle } from '@/components/mode-toggle'
import WidthWrapper from '@/components/WidthWrapper'
import React from 'react'

const SettingsPage = () => {
  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 mt-16'>
      <h2 className='text-lg md:text-xl tracking-tighter'>Settings Page</h2>

      <div className='mt-8 flex flex-col space-y-3'>
        <h2 className='text-lg md:text-xl tracking-tighter'>Theme</h2>
        <ModeToggle />
      </div>
    </WidthWrapper>
  )
}

export default SettingsPage
