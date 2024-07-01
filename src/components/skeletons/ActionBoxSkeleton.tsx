import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ActionBoxSkeleton = () => {
  return (
    <Skeleton className='w-full max-w-3xl justify-between'>
        <div className='flex flex-col space-y-2'>
            <Skeleton className='w-full max-w-36 h-12' />
            <Skeleton className='w-ful max-w-24l h-12' />
        </div>
        <div className='flex flex-col space-y-2'>
            <Skeleton className='w-full max-w-24 h-12' />
            <Skeleton className='w-full max-w-20 rounded-full h-12' />
        </div>
    </Skeleton>
  )
}

export default ActionBoxSkeleton
