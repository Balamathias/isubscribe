import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { TabsList, TabsTrigger, Tabs } from '../ui/tabs'

const ActionBoxSkeleton = ({ isHome = false }) => {
  return (
    <Tabs className='flex flex-col gap-y-4 max-w-3xl'>
      {!isHome && <div className='flex flex-row items-center gap-x-5'>
        <TabsList className="grid w-full grid-cols-2 gap-4 rounded-xl shadow-none border-none py-2 h-fit bg-transparent">
            <TabsTrigger value="wallet" className={` w-full h-9 rounded-xl ring-1 data-[state=active]:bg-background  data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-400/80 md:text-lg data-[state=active]:shadow-none peer bg-gray-50/80 dark:bg-card/70 text-sm`}>Wallet</TabsTrigger>
            <TabsTrigger value="other" className={` w-full h-9 md:text-lg text-sm ring-1 rounded-xl data-[state=active]:bg-background peer-hover:opacity-90  data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-400/80 data-[state=active]:shadow-none bg-gray-50/80 dark:bg-card/70`}>Others</TabsTrigger>
        </TabsList>
      </div>}

      <div className='flex flex-col gap-y-5'>
        <Skeleton className='w-full justify-between h-[78px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[78px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[78px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[78px] rounded-xl' />
        <Skeleton className='w-full justify-between h-[78px] rounded-xl' />
      </div>
    </Tabs>
  )
}

export default ActionBoxSkeleton
