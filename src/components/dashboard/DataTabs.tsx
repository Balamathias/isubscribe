'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Image from 'next/image'
import { Input } from '../ui/input'

const tabs = [
    {
        name: 'Subs',
        value: 'hot',
    },
    {
        name: 'Daily',
        value: 'daily',
    },
    {
        name: 'Night',
        value: 'night',
    },
    {
        name: 'Weekend',
        value: 'weekend',
    },
    {
        name: 'Weekly',
        value: 'weekly',
    },
    {
        name: 'Monthly',
        value: 'monthly',
    },
    {
        name: 'Social',
        value: 'social',
    },
    {
        name: 'Special',
        value: 'special',
    },
]

const DataTabs = () => {
    const className = `w-full h-9 md:text-lg text-xs rounded-none data-[state=active]:bg-background peer-hover:opacity-90 data-[state=active]:text-violet-800 data-[state=active]:border-b-2 md:data-[state=active]:border-b-4 data-[state=active]:border-violet-600 data-[state=active]:shadow-none bg-gray-50/80 rounded-md`

  return (
    <div className='flex-col gap-y-6 md:gap-y-10 max-sm:w-[90vw] w-[600px]'>
        <div className='flex flex-col gap-y-4 py-4'>
            <div className='flex flex-row gap-x-2 items-center'>
                <Image 
                    src='/images/networks/mtn.png' 
                    width={50} 
                    height={50} 
                    quality={100}
                    alt='mtn' 
                    className='rounded-md md:h-16 md:w-16 h-12 w-12'
                />
                <Input 
                    placeholder='Your Phone Number'
                    className='focus-within:outline h-12 bg-white items-center focus:ring-0 focus-within:ring-0 rounded-lg border-none shadow-none drop-shadow-none'
                />
            </div>
        </div>
      <Tabs defaultValue="hot" className=" space-y-6 ">

        <TabsList className="grid w-full grid-cols-4 gap-2 rounded-xl shadow-none border-none p-2 py-4 h-fit bg-transparent">
            {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className={className}>
                {tab.name}
                </TabsTrigger>
            ))}
        </TabsList>

        {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="p-4 bg-white rounded-xl shadow-none">
                <h2 className='text-muted-foreground text-xl font-semibold'>{tab.name}</h2>
            </TabsContent>
        ))}

      </Tabs>
    </div>
  )
}

export default DataTabs
