'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Card } from '@/components/ui/card'
import { LucideArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import CreateUpdateSecurityQuestion from '../create-update-security-question'
import { Tables } from '@/types/database'
import ConfirmPin from '../ConfirmPin'
import DynamicModal from '@/components/DynamicModal'

const SettingsComponent = ({ profile }: { profile: Tables<'profile'> }) => {
  const { theme } = useTheme()

  const [updateSecurityQ, setUpdateSecurityQ] = useState(Boolean(profile?.security_question && profile?.security_answer))
  const [openUpdateSecurityModal, setOpenUpdateSecurityModal] = useState(false)

  return (
    <div className='flex flex-col gap-y-4'>
        <Card className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none'>
            <div className="flex flex-col space-y-1">
                <h2 className='text-lg md:text-xl tracking-tighter'>Theme</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">{theme}</span>
            </div>
            <ModeToggle />
        </Card>

        <Card className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:opacity-65 hover:transition-all'>
            <div className="flex flex-col space-y-1">
                <h2 className='text-lg md:text-xl tracking-tighter'>Reset PIN</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Reset your transaction pin</span>
            </div>
            <LucideArrowRight className='w-6 h-6 text-gray-500 dark:text-gray-400' />
        </Card>

        <Card 
            className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:opacity-65 hover:transition-all'
            onClick={() => setOpenUpdateSecurityModal(prev => !prev)}
        >
            <div className="flex flex-col space-y-1">
                <h2 className='text-lg md:text-xl tracking-tighter'>Edit Security Question</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Edit your security question and answer.</span>
            </div>
            <LucideArrowRight className='w-6 h-6 text-gray-500 dark:text-gray-400' />
        </Card>

        <DynamicModal
            open={openUpdateSecurityModal}
            setOpen={setOpenUpdateSecurityModal}
            dialogClassName='sm:max-w-max dark:bg-slate-950 !p-0'
        >
            <ConfirmPin 
                profile={profile}
                func={() => {
                    setUpdateSecurityQ(false)
                    setOpenUpdateSecurityModal(false)
                }}
            />
        </DynamicModal>
        
        <CreateUpdateSecurityQuestion
            open={updateSecurityQ} 
            setOpen={setUpdateSecurityQ}
            update
            data={{
                security_question: profile?.security_question!,
                security_answer: profile?.security_answer!,
            }}
        />

    </div>
  )
}

export default SettingsComponent