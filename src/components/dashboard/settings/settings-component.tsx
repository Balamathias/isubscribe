'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { useTheme } from 'next-themes'
import { Tables } from '@/types/database'
import SecurityQuestion from './security-question'
import ResetPIN from './reset-pin'
import EnableBiometricAuth from './enable-biometric-auth'
import SettingItem from './setting-item'
import { MoonIcon, SunIcon } from 'lucide-react'
import ComingSoon from '../comig-soon'

import { LucideShieldCheck } from 'lucide-react'


const SettingsComponent = ({ profile }: { profile?: Tables<'profile'> | null }) => {
  const { theme } = useTheme()

  return (
    <div className='flex flex-col gap-y-4'>
        <SettingItem 
          title='Theme'
          description={`Change your theme to ${theme === 'dark' ? 'light' : 'dark'}`}
          icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          indicator={<ModeToggle />}
        />

        <ResetPIN />

        <SecurityQuestion profile={profile} />

        <EnableBiometricAuth profile={profile} />

        <ComingSoon 
          trigger={
            <SettingItem 
              title='Verify BVN or NIN'
              description={'Verify your BVN or NIN'}
              icon={<LucideShieldCheck />}
              iconClassName='text-amber-500 bg-amber-500/15'
            />
          }
          message='This feature is coming soon where you can verify your BVN or NIN.'
        />
    </div>
  )
}

export default SettingsComponent