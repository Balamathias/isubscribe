import React from 'react'
import { Skeleton } from '../ui/skeleton'

const HistoryDetailSkeletopn = () => {
  return (
    <div className='flex flex-col gap-y-8'>
        <Skeleton className='max-w-3xl rounded-2xl h-64 w-full' />
        <Skeleton className='max-w-3xl rounded-2xl h-80 w-full' />
    </div>
  )
}

export default HistoryDetailSkeletopn