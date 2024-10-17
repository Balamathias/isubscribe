import DynamicModal from '@/components/DynamicModal'
import React, { useEffect, useState } from 'react'
import ConfirmPin from '../ConfirmPin'
import CreateUpdateSecurityQuestion from '../create-update-security-question'
import { Tables } from '@/types/database'
import { Card } from '@/components/ui/card'
import { LucideArrowRight } from 'lucide-react'

const SecurityQuestion = ({ profile }: { profile: Tables<'profile'> }) => {

  const [updateSecurityQ, setUpdateSecurityQ] = useState(true)
  const [openUpdateSecurityModal, setOpenUpdateSecurityModal] = useState(false)

  return (
    <div>
        <Card 
            className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:opacity-65 hover:transition-all'
            onClick={() => setOpenUpdateSecurityModal(prev => !prev)}
        >
            <div className="flex flex-col space-y-1">
                <h2 className='text-lg md:text-xl tracking-tighter'>Edit Security Question</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">{profile?.security_question ? profile?.security_question : 'Edit your security question and answer.'}</span>
            </div>
            <LucideArrowRight className='w-6 h-6 text-gray-500 dark:text-gray-400' />
        </Card>

        <DynamicModal
            open={openUpdateSecurityModal}
            setOpen={setOpenUpdateSecurityModal}
            dialogClassName='sm:max-w-max dark:bg-card !p-0'
            drawerClassName='dark:bg-card'
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

export default SecurityQuestion