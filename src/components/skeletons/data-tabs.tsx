import React from 'react'
import { Skeleton } from '../ui/skeleton'

const DataTabsSkeleton = () => {
  return (
    <div className='flex-col gap-y-6 md:gap-y-10 max-sm:w-[90vw] w-[600px]'>
      <div className='flex flex-col gap-y-4 py-4'>
        <div className='flex flex-row gap-x-2 items-center'>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
      <div defaultValue="hot" className="space-y-6">
        <div className="grid w-full grid-cols-4 gap-2 rounded-xl shadow-none border-none p-2 py-4 h-fit bg-transparent">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
        <div className="p-4 rounded-xl flex flex-col gap-y-2.5 shadow-none">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}

export default DataTabsSkeleton