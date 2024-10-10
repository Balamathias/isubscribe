import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ActionBoxSkeleton = () => {
  return (
    <section className='flex flex-col gap-y-4 max-w-3xl'>
      <div className='flex flex-row items-center gap-x-5'>
        <Skeleton className='w-full justify-between h-[50px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[50px] rounded-xl' />
      </div>

      <div className='flex flex-col gap-y-4'>
        <Skeleton className='w-full justify-between h-[90px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[90px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[90px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[90px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[90px] rounded-xl' />
      </div>
    </section>
  )
}

export default ActionBoxSkeleton
