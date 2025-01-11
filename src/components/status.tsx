import { cn } from '@/lib/utils'
import type { Status } from '@/types/constants'
import { LucideCheckCircle, LucideRefreshCcw, LucideX, LucideXCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface StatusProps {
    className?: string,
    status: Status,
    type?: 'text' | 'icon' | 'image',
    message?: string
}

const Status = ({ className, status, type = 'text', message=status }: StatusProps) => {
  return type === 'text' ? (
    <span 
        aria-label={status} 
        className={
            cn(
                'flex items-center justify-center text-center py-0.5 px-3 text-xs md:text-sm rounded-full w-fit', 
                {
                    'bg-yellow-600/10 text-yellow-600': status === 'pending',
                    'bg-green-600/10 text-green-600': status === 'success',
                    'bg-red-600/10 text-red-600': status === 'failed',
                    'bg-sky-600/10 text-sky-600': status === 'reversed',
                    'py-2': message && message !== ''
                }, 
                className,
            )
            }>
        {message || status}
    </span>
  ): type === 'image' ? (
    <span 
        aria-label={status} 
        className={
            cn(
                'flex items-center justify-center text-center h-12 w-12 text-xs md:text-sm rounded-full', 
                {
                    'bg-yellow-600/10 text-yellow-600': status === 'pending',
                    'bg-green-600/10 text-green-600': status === 'success',
                    'bg-red-600/10 text-red-600': status === 'failed',
                    'bg-sky-600/10 text-sky-600': status === 'reversed',
                }, 
                className,
            )
            }>
        {
            status === 'success' && <Image src={'/icons/check.png'} alt={status} className='object-cover w-full h-full' width={500} height={500} />
        }
        {
            status === 'pending' && <Image src={'/icons/pending.png'} alt={status} className='object-cover w-full h-full' width={500} height={500} />
        }
        {
            status === 'failed' && <Image src={'/icons/x.png'} alt={status} className='object-cover w-full h-full' width={500} height={500} />
        }
    </span>
): (
    <span 
        aria-label={status} 
        className={
            cn(
                'flex items-center justify-center text-center h-10 w-10 text-xs md:text-sm rounded-full', 
                {
                    'bg-yellow-600/10 text-yellow-600': status === 'pending',
                    'bg-green-600/10 text-green-600': status === 'success',
                    'bg-red-600/20 text-red-600': status === 'failed',
                    'bg-sky-600/10 text-sky-600': status === 'reversed',
                }, 
                className,
            )
            }>
        {
            status === 'success' && <LucideCheckCircle size={16} />
        }
        {
            status === 'pending' && <LucideRefreshCcw size={16} />
        }
        {
            status === 'failed' && <LucideX size={16} />
        }
        {
            status === 'reversed' && <LucideRefreshCcw size={16} />
        }
    </span>
)
}

export default Status