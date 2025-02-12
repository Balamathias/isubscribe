'use client'

import { LucideInfo } from 'lucide-react'
import React from 'react'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Error | user ~ isubscribe',
  description: 'Isubscribe user'
}

const Error = ({ reset }: { reset: () => any }) => {
  return (
    <div className='min-h-screen p-4 flex items-center justify-center'>
        <div className='flex flex-col gap-y-4 items-center justify-center rounded-lg p-6 text-center'>
          <div className='w-16 h-16 flex items-center justify-center rounded-full bg-red-600/20'>
              <LucideInfo className='text-red-600 w-10 h-10' />
          </div>
          <h2 className='text-xl md:text-2xl font-semibold'>Oops! Something went wrong.</h2>
          <p className='text-muted-foreground'>We encountered an unexpected error. Please try again later or return to the homepage.</p>
          <Button onClick={reset} variant='ghost' className='py-2 px-6 mt-3 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-600 hover:bg-violet-700 focus:outline-none'>
              Refresh
          </Button>
        </div>
    </div>
  )
}

export default Error
