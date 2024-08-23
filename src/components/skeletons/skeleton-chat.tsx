import { cn } from '@/lib/utils'
import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SkeletonChat = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      {[1, 2, 3, 4].map((_, index) => (
        <div className={cn("flex items-start gap-x-2")} key={index}>
            <Skeleton
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
                <Skeleton className='h-20 w-full rounded-xl' />
            </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonChat