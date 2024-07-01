'use client'

import DynamicModal from '@/components/DynamicModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signOut } from '@/lib/supabase/user.actions'
import React, { ReactNode, useEffect, useState } from 'react'
import { createContext } from 'react'

const AppContext = createContext<{
    setIsOnline: React.Dispatch<React.SetStateAction<boolean>>,
    isOnline: boolean
}>({
    isOnline: true,
    setIsOnline: () => {}
})

const AppStateProvider = ({ children }: { children: ReactNode }) => {

    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        const listener = window.addEventListener('visibilitychange', e => {
            const timeout = setTimeout(async () => {
                if (document.visibilityState === 'visible') {
                    setIsOnline(true)
                } else {
                    setIsOnline(false)
                    const timeout = setTimeout(async () => {
                      await signOut()
                    }, (1000 * 60 * 60 * 6))
                    return () => clearTimeout(timeout)
                }
            }, 1000)

            return () => {clearTimeout(timeout)}
        })

        return () => {window.removeEventListener('visibilitychange', (e) => listener)}
    }, [])

  return (
    <AppContext.Provider value={{isOnline, setIsOnline}}>
      {children}

      {/* {
        !isOnline && <DynamicModal open>
            <h2 className='text-2xl tracking-tight text-primary/80 font-semibold'>Hey, You logged out.</h2>
            <p className='text-muted-foreground'>Hi there, you logged out, kindly enter your 4 digit pin to continue.</p>
            <Input type='number' className='w-fit border shadow-none ring-0 focus:ring-0 mt-2' placeholder='Your 4 digit PIN.' />

            <div className='flex justify-end'>
                <Button className='rounded-xl ring-0'>Submit</Button>
            </div>
        </DynamicModal>
      } */}
    </AppContext.Provider>
  )
}

export default AppStateProvider
