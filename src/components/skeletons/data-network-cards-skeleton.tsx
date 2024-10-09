import React from 'react'
import { Skeleton } from '../ui/skeleton'

const DataNetworkCardSkeleton = () => {
  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
      {Array(15).fill(0).map((_, idx) => (
        <div key={idx} className="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-card/80 shadow-sm">
          <Skeleton className="w-16 h-16 rounded-full mb-2" />
          <Skeleton className="w-3/4 h-4 mb-1" />
          <Skeleton className="w-1/2 h-3 mb-1" />
          <Skeleton className="w-2/3 h-3" />
        </div>
      ))}
    </div>
  )
}

export default DataNetworkCardSkeleton