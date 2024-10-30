import DynamicModal from '@/components/DynamicModal'
import React, { useEffect, useState } from 'react'
import ConfirmPin from '../ConfirmPin'
import CreateUpdateSecurityQuestion from '../create-update-security-question'
import { Tables } from '@/types/database'
import { Card } from '@/components/ui/card'
import { FileQuestion, LucideArrowRight } from 'lucide-react'
import SettingItem from './setting-item'
import PleaseSignIn from '../please-sign-in.modal'

const SecurityQuestion = ({ profile }: { profile?: Tables<'profile'> | null }) => {

  const [updateSecurityQ, setUpdateSecurityQ] = useState(true)
  const [openUpdateSecurityModal, setOpenUpdateSecurityModal] = useState(false)

  return (
    <div>
        {
            profile ? (
                <SettingItem 
                    icon={<FileQuestion />}
                    iconClassName='text-blue-500 bg-blue-500/15'
                    title={'Edit Security Question'}
                    description='Edit your security question and answer.'
                    onClick={() => setOpenUpdateSecurityModal(prev => !prev)}
                />
                
            ) : (
                <PleaseSignIn
                    message='Please sign in to edit your security question'
                    trigger={
                        <SettingItem 
                            icon={<FileQuestion />}
                            iconClassName='text-blue-500 bg-blue-500/15'
                            title={'Edit Security Question'}
                            description='Edit your security question and answer.'
                        />
                    }
                />
            )
        }
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