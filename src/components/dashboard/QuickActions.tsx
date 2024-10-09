import { Card } from '@/components/ui/card'
import { quickActionsLinks } from '@/utils/constants/navLinks'
import Link from 'next/link'
import React from 'react'

const QuickActions = () => {
  return (
    <div className=' flex flex-col gap-2 py-8'>
        <h1 className=' text-lg text-foreground/80 font-semibold'>Quick Actions</h1>

        <Card className='grid grid-flow-row grid-cols-4 gap-4 bg-white dark:bg-card/80 p-5 rounded-xl border-none drop-shadow-none shadow-none'>
            {
            quickActionsLinks.map((link,idx) => (
                <div key={idx} className=' '>
                    <Link href={link?.href} className={` flex flex-col gap-1 items-center justify-center`}>
                        <link.icon size={32} className={ "p-2 rounded-xl hover:opacity-80 text-violet-600 dark:text-violet-100 bg-violet-100 dark:bg-gray-900/80 hover:p-1 hover:bg-violet-200 hover:rounded-lg hover:duration-200 hover:transition-all"} />
                        <span className='text-xs md:text-sm text-nowrap text-gray-700/90 dark:text-muted-foreground tracking-tight'>{link?.label}</span>
                    </Link>
                </div>
            ))
            }
        </Card>

    </div>
  )
}

export default QuickActions