import React from 'react'
import { Skeleton } from '../ui/skeleton'

const NetworkCardSkeleton = () => {
  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {
            Array(15).fill(0).map((item, idx) => (
                <Skeleton 
                    key={idx}
                    className='h-28 shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all'
                />
            ))
        }
    </div>
  )
}

export default NetworkCardSkeleton