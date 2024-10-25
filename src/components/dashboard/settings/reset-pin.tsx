'use client'

import DynamicModal from '@/components/DynamicModal'
import React, { useState } from 'react'
import ConfirmPin from '../ConfirmPin'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { Lock } from 'lucide-react'
import PassPinForm from '../PassPinForm'
import SettingItem from './setting-item'

const ResetPIN = () => {
  const [confirmPin, setConfirmPin] = useState(false)
  const { data: profile } = useGetProfile()

  const [showResetPinForm, setShowResetPinForm] = useState(false)

  return (
    <div className='flex flex-col'>
        <DynamicModal
            open={confirmPin}
            setOpen={setConfirmPin}
            dialogClassName='sm:max-w-max dark:bg-card !p-0'
            drawerClassName="dark:bg-card"
            trigger={
                <SettingItem 
                    icon={<Lock />}
                    iconClassName='text-green-500 bg-green-500/15'
                    title='Reset PIN'
                    description='Reset your transaction pin'
                />
            }
        >
            <ConfirmPin 
                profile={profile?.data!}
                func={() => {
                    setShowResetPinForm(true)
                    setConfirmPin(false)
                }}
            />
        </DynamicModal>

        {showResetPinForm && <DynamicModal
            open={showResetPinForm}
            setOpen={setShowResetPinForm}
            dialogClassName='sm:max-w-max dark:bg-card !p-0'
            drawerClassName='dark:bg-card'
        >
            <PassPinForm 
                update
                className='shadow-none drop-shadow-none'
                onClose={() => {
                    setShowResetPinForm(false)
                }}
            />
        </DynamicModal>}
    </div>
  )
}

export default ResetPIN