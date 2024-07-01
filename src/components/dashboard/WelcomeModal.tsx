'use client'

import React, { useState } from 'react'
import DynamicModal from '../DynamicModal'
import { Tables } from '@/types/database'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const WelcomeModal = ({profile, step}: { profile: Tables<'profile'>, step: string }) => {
    const searchParams = useSearchParams()
    const urlParams = new URLSearchParams(searchParams.toString())
    const router = useRouter()

    const [open, setOpen] = useState(step==='welcome')

    const handleCloseModal = () => {
        urlParams.set('step', 'done')
        router.replace('?' + urlParams.toString())
        setOpen(false)
    }

  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
    >
        <div className='py-3 p-2 flex flex-col space-y-2.5'>
            <h2 className='text-lg'>Hi <span className="text-primary font-semibold">{profile?.full_name}</span>, Welcome back!</h2>
            <p>Thank you for signing up for <span className="text-primary">iSubscribe</span>, start exploring our services! How would you like to start?</p>

            <div className='flex flex-row gap-x-2 items-center flex-wrap pt-2 mt-3 md:-mb-2 justify-end'>
                <Button onClick={handleCloseModal} variant={'destructive'} className='focus:outline-none rounded-xl focus:ring-0 focus-within:ring-0'>I know</Button>
            </div>
        </div>
    </DynamicModal>
  )
}

export default WelcomeModal
