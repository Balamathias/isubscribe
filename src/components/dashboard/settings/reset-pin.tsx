'use client'

import DynamicModal from '@/components/DynamicModal'
import React, { useState } from 'react'
import ConfirmPin from '../ConfirmPin'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { Card } from '@/components/ui/card'
import { LucideArrowRight } from 'lucide-react'
import PassPinForm from '../PassPinForm'

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
                <Card className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:opacity-65 hover:transition-all'>
                    <div className="flex flex-col space-y-1">
                        <h2 className='text-lg md:text-xl tracking-tighter'>Reset PIN</h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Reset your transaction pin</span>
                    </div>
                    <LucideArrowRight className='w-6 h-6 text-gray-500 dark:text-gray-400' />
                </Card>
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