'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Card } from '@/components/ui/card'
import { LucideArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

const SettingsComponent = () => {
    const { theme } = useTheme()
  return (
    <div className='flex flex-col gap-y-4'>
        <Card className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none'>
            <div className="flex flex-col space-y-1">
                <h2 className='text-lg md:text-xl tracking-tighter'>Theme</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">{theme}</span>
            </div>
            <ModeToggle />
        </Card>

        <Card className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:opacity-65 hover:transition-all'>
            <div className="flex flex-col space-y-1">
                <h2 className='text-lg md:text-xl tracking-tighter'>Reset PIN</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Reset your transaction pin</span>
            </div>
            <LucideArrowRight className='w-6 h-6 text-gray-500 dark:text-gray-400' />
        </Card>
    </div>
  )
}

export default SettingsComponent