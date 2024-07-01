'use client'

import React, { useEffect } from 'react'
import DynamicModal from './DynamicModal'
import { useCurrentUser } from '@/providers/user-provider'
import { Button } from './ui/button'
import Image from 'next/image'

const GreetingModal = () => {
    const [hasGreetedBefore, setHasGreetedBefore] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const user = useCurrentUser()

    useEffect(() => {
        const hasGreetedBeforeStatus = JSON.parse(localStorage.getItem('hasGreetedBefore') || '0') as boolean
        if (!hasGreetedBeforeStatus) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
            localStorage.setItem('hasGreetedBefore', JSON.stringify(true))
        }
    }, [])
  return (
    <DynamicModal
        open={isOpen}
        setOpen={setIsOpen}
    >
        <div className="p-3 flex flex-col ga-4 items-center justify-center">
            <Image 
                src='/glass/images/sun-rise.png' 
                width={150} 
                height={150} 
                alt='Greeting Image'
                className='object-cover'
                quality={100} 
            />
            <div className="flex flex-col gap-3">
                <h2 className='py-2 font-semibold text-xl'>Hi {user?.currentAccountUser?.username}, Welcome to SubMe!</h2>
                <p className='py-1 text-muted-foreground tracking-tighter'>Thank you for signing up to SubMe today, your ultimate data and Airtime plug!</p>
                <Button 
                    onClick={() => {
                        setIsOpen(false)
                        localStorage.setItem('hasGreetedBefore', JSON.stringify(true))
                    }} 
                    className='bg-gradient-to-tr from-yellow-400 to-yellow-600 hover:bg-yellow-700 border-none outline-none mt-4 w-full rounded-full focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-transparent focus:ring-offset-0'
                >Close</Button>
            </div>
        </div>
    </DynamicModal>
  )
}

export default GreetingModal