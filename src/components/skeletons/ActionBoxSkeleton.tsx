import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ActionBoxSkeleton = ({ isHome = false }) => {
  return (
    <section className='flex flex-col gap-y-4 max-w-3xl'>
      {!isHome && <div className='flex flex-row items-center gap-x-5'>
        <Skeleton className='w-full justify-between h-[40px] rounded-full' />
        <Skeleton className='w-full justify-between h-[40px] rounded-full' />
      </div>}

      <div className='flex flex-col gap-y-4'>
        <Skeleton className='w-full justify-between h-[80px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[80px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[80px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[80px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[80px] rounded-xl' />
      </div>
    </section>
  )
}

export default ActionBoxSkeleton
