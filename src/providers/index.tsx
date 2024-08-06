'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import QueryProvider from './query-provider'
import AppStateProvider from './app-state-provider'
import { Toaster } from '@/components/ui/sonner'
import useOnlineStatus from '@/hooks/useOnlineStatus'
import DynamicModal from '@/components/DynamicModal'

const Providers = ({ children }: { children: ReactNode }) => {
  // const isOnline = useOnlineStatus()
  return (
    <>
    <ThemeProvider attribute='class'>
      <QueryProvider>
        <AppStateProvider>
            { children }
            <Toaster />
        </AppStateProvider>
      </QueryProvider>
    </ThemeProvider>

    {/* <DynamicModal
      open={!isOnline}
      dismissible={false}
      dialogClassName='!bg-red-600/20'
    >
      <div className='p-4 flex flex-col gap-y-3.5'>
        <h2 className='text-red-500/90 text-base md:text-lg font-semibold'>You are offline</h2>
        <p className='text-muted-foreground tracking-tighter text-xs md:text-sm'>
          Please, ensure you are connected to the internet to continue using iSubscribe.
        </p>
      </div>
    </DynamicModal> */}
    </>
  )
}

export default Providers
