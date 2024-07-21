"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Image from 'next/image'
import { useTvCable } from '@/providers/tv-cable/tv-cable-provider'
import { Card } from '../ui/card'
import { Tv, User } from 'lucide-react'
import { Input } from '../ui/input'
import { dstv_subscription, gotv_subscription, showmax_subscription, startimes_subscription } from '@/utils/constants/tv-plans'
import { TvCables } from '@/types/tv-cable'
import { Button } from '../ui/button'
import TvCards from './tv-cable/tv-cards'

export const tvImages = {
    'dstv': '/images/tv-cables/ds-tv-logo.jpg',
    'gotv': '/images/tv-cables/go-tv-logo.png',
    'star-times': '/images/tv-cables/star-times-logo.png',
    'show-max': '/images/tv-cables/show-max-logo.png',
}

const tvTabs = [
    {
        name: 'DSTV',
        value: 'dstv',
        image: '/images/tv-cables/ds-tv-logo.jpg',
       
    },
    {
        name: 'GOTV',
        value: 'gotv',
        image: '/images/tv-cables/go-tv-logo.png',
    },
    {
        name: 'Star Times',
        value: 'startimes',
        image: '/images/tv-cables/star-times-logo.png',
    },
    {
        name: 'ShowMax',
        value: 'showmax',
        image: '/images/tv-cables/show-max-logo.png',
    },

]

const SelectTvProvider = () => {
    const { currentProvider, mobileNumber, setMobileNumber, setCurrentProvider, setSmartcardNumber } = useTvCable()


  return (
    <Tabs defaultValue="dstv" className="max-sm:w-[90vw] w-[600px] space-y-4">
    <TabsList className="flex flex-row justify-between gap-2 h-fit">
      {tvTabs.map(({ value, image, name }:{value: string, image:string, name:string}) => (
        <TabsTrigger
          key={value}
          value={value}
          onClick={() => setCurrentProvider(value as TvCables)}
          className={`h-[70px] w-[70px] md:w-[120px] md:h-[120px] hover:opacity-90 bg-violet-100 text-gray-700
            `}
        >
          <Image src={image} height={1000} width={1000} alt={name} className='rounded-full shadow-2xl ' />
        </TabsTrigger>
      ))}
    </TabsList>

    <Card className="bg-white p-4 flex flex-row gap-2  justify-center w-full">
        <span className="text-white p- rounded-full bg-violet-500 p-1 md:p-2">
        <Tv />
        </span>
        <Input 
        onChange={(e) => setSmartcardNumber(e.target.value)}  
        type="tel" 
        placeholder="Enter Decoder Number here..."
            />
    </Card>
    <Card className="bg-white p-4 flex flex-row gap-2  justify-center w-full">
        <span className="text-white p- rounded-full bg-violet-500 p-1 md:p-2">
        <User />
        </span>
        <Input 
        onChange={(e) => setMobileNumber(e.target.value)}  
        type="tel" 
        defaultValue={mobileNumber}
        placeholder="Enter Phone Number here..."
            />
    </Card>

    <TvCards />

    </Tabs>
  )
}

export default SelectTvProvider