'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import QueryProvider from './query-provider'
import AppStateProvider from './app-state-provider'
import { Toaster } from '@/components/ui/sonner'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute='class'>
      <QueryProvider>
        <AppStateProvider>
            { children }
            <Toaster />
        </AppStateProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default Providers
