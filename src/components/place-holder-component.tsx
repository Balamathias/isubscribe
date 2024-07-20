import { LucideBarChart } from 'lucide-react'
import React from 'react'

const PlaceHolder = () => {
  return (
    <div className='flex flex-col p-4 items-center justify-center rounded-xl bg-white dark:bg-secondary py-6'>
        <div className='w-10 h-10 flex justify-center items-center rounded-full bg-rose-100 dark:bg-secondary'>
            <LucideBarChart className='text-red-800' />
        </div>
        <h2 className='text-2xl font-semibold text-red-500'>Coming Soon</h2>
        <p className='text-center text-sm tracking-tighter text-muted-foreground'>This feature is currently in development. Check back later</p>
    </div>
  )
}

export default PlaceHolder