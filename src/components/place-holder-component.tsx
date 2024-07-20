import { LucideBarChart } from 'lucide-react'
import React from 'react'

const PlaceHolder = ({ description, title }: { title?: string, description?: string }) => {
  return (
    <div className='flex flex-col p-4 items-center justify-center rounded-xl bg-white dark:bg-secondary py-6 gap-y-2'>
        <div className='w-10 h-10 flex justify-center items-center rounded-full bg-blue-100 dark:bg-secondary'>
            <LucideBarChart className='text-blue-600' />
        </div>
        <h2 className='md:text-xl text-center text-lg font-semibold text-blue-500'>{title ? title : 'Coming Soon'}</h2>
        <p className='text-center text-sm tracking-tighter text-muted-foreground'>{description ? description : 'This feature is currently in development. Check back later'}</p>
    </div>
  )
}

export default PlaceHolder