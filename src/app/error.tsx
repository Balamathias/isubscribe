'use client'

import { LucideInfo } from 'lucide-react'
import React from 'react'

const Error = ({ reset }: { reset: () => any }) => {
  return (
    <div className='min-h-screen p-4 flex items-center justify-center'>
        <div className='flex flex-col gap-y-1.5 items-center justify-center'>
          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-red-600/20'>
              <LucideInfo className='text-red-600' />
          </div>
          <h2 className='tracking-tighter text-base md:text-lg py-2'>An error has occured.</h2>
          <button onClick={reset} className='py-2 px-4 mt-3 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-600 focus:outline-none outline-none'>
              Refresh
          </button>
        </div>
    </div>
  )
}

export default Error