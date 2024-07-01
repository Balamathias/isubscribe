'use client'

import React, { PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/sonner'
import QueryProvider from './query-provider'
import AppStateProvider from './app-state-provider'

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <AppStateProvider>
        <ThemeProvider attribute='class' defaultTheme='light'>
          {children}
          <Toaster />
        </ThemeProvider>
      </AppStateProvider>
    </QueryProvider>
  )
}

export default Providers
