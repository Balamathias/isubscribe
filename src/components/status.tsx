import { cn } from '@/lib/utils'
import type { Status } from '@/types/constants'
import React from 'react'

interface StatusProps {
    className?: string,
    status: Status
}

const Status = ({ className, status }: StatusProps) => {
  return (
    <span 
        aria-label={status} 
        className={
            cn(
                'flex items-center justify-center text-center py-0.5 px-3 text-xs md:text-sm rounded-full w-fit', 
                {
                    'bg-yellow-600/10 text-yellow-600': status === 'pending',
                    'bg-green-600/10 text-green-600': status === 'success',
                    'bg-red-600/10 text-red-600': status === 'failed',
                }, 
                className,
            )
            }>
        {status}
    </span>
  )
}

export default Status