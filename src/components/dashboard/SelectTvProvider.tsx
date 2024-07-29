"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Image from 'next/image'
import { useTvCable } from '@/providers/tv-cable/tv-cable-provider'
import { Card } from '../ui/card'
import { Check, CheckCircle, Loader, Loader2, Tv, User, X } from 'lucide-react'
import { Input } from '../ui/input'
import { dstv_subscription, gotv_subscription, showmax_subscription, startimes_subscription } from '@/utils/constants/tv-plans'
import { TvCables } from '@/types/tv-cable'
import { Button } from '../ui/button'
import TvCards from './tv-cable/tv-cards'
import { verifySmartcardNumber } from '@/lib/vtpass/services'
import CustomInput from './CustomInput'

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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [data, setData] = useState<any>(null)

    const { currentProvider, mobileNumber, setMobileNumber, setCurrentProvider, smartcardNumber, setSmartcardNumber } = useTvCable()
    const payload = {
      serviceID:currentProvider,
      billersCode:smartcardNumber
    }

    const handleSmartcardNumberChange = (e:any) => {
      const value = e.target.value;
      if (/^\d{0,10}$/.test(value)) {
        setSmartcardNumber(value);
      }
    };

    const isSmartCardNumberNotLessThanOne = smartcardNumber?.length !== 0

   

    const handleVerifySmartCard = async () => {
      setLoading(true)
      setSuccess(false)
      setError(false)
      const res = await verifySmartcardNumber(payload)
      setData(res?.content)
      if(res?.content?.Customer_Name){
        setSuccess(true)
        setError(false)
        setLoading(false)
      }
      if(res?.content?.error){
        setError(true)
        setSuccess(false)
        setLoading(false)
      }
      console.log("22222", res)
      setLoading(false)
    }

    useEffect(() => {
      if (smartcardNumber?.length === 10 ) {
        handleVerifySmartCard()
      }
    }, [smartcardNumber]);

  return (
    <Tabs defaultValue="dstv" className="max-sm:w-[90vw] w-[600px] space-y-4">
    <TabsList className="flex flex-row justify-between gap-2 h-fit">
      {tvTabs.map(({ value, image, name }:{value: string, image:string, name:string}) => (
        <TabsTrigger
          key={value}
          value={value}
          onClick={() => setCurrentProvider(value as TvCables)}
          className={`h-[70px] w-[70px] md:w-[120px] md:h-[120px] hover:opacity-90 data-[state=active]:bg-card
            `}
        >
          <Image src={image} height={1000} width={1000} alt={name} className='rounded-full shadow-2xl ' />
        </TabsTrigger>
      ))}
    </TabsList>

    <Card className="flex flex-col justify-between space-y-3 bg-card dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:transition-all hover:opacity-65 peer peer-hover:opacity-75 peer-hover:transition-all hover:duration-300 peer-hover:duration-300">
       <div className='flex flex-row gap-2  items-center'>
          <span className="text-white rounded-full bg-violet-500 h-10 w-10 flex items-center justify-center">
          <Tv size={16} />
          </span>
          <CustomInput 
            onChange={handleSmartcardNumberChange}  
            value={smartcardNumber}
            type="tel" 
            className="w-[92%] max-sm:w-[85%]"
            placeholder="Enter Decoder Number here..."
          />
       </div>

       {
        loading &&
         (
          <div className='flex flex-row gap-2  justify-cente items-center'>
          <span className="text-violet-600 p- rounded-full bg-white dark:bg-secondary h-10 w-10 flex items-center justify-center">
          <Loader2 className=' animate-spin' />
          </span>
          <span className=' h-8 w-full bg-gray-300 rounded-sm animate-pulse'></span>
         </div>
        ) 
      }
        
      { success && isSmartCardNumberNotLessThanOne &&
        (
          <div className='flex flex-row gap-2  justify-cente items-center'>
          <span className="text-violet-600 p- rounded-full bg-green-100 dark:bg-secondary p-1 md:p-1">
          <Check className=' text-green-500' size={16} />
          </span>
          <span className=' '> {data?.Customer_Name}</span>
         </div>

        )
       }
      { error && isSmartCardNumberNotLessThanOne &&
        (
          <div className='flex flex-row gap-2  justify-cente items-center'>
          <span className="text-violet-600 p- rounded-full bg-red-100 dark:bg-secondary p-1 md:p-1">
          <X className=' text-red-500' size={16} />
          </span>
          <span className=' '> {data?.error}</span>
         </div>

        )
       }
      
    </Card>
    <Card className="flex flex-col justify-between space-y-3 bg-card dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:transition-all hover:opacity-65 peer peer-hover:opacity-75 peer-hover:transition-all hover:duration-300 peer-hover:duration-300">
        <div className='flex flex-row space-x-1.5 items-center'>
          <span className="text-white p- rounded-full bg-violet-500 h-10 w-10 flex items-center justify-center">
            <User size={16}/>
          </span>
          <CustomInput 
            onChange={(e) => setMobileNumber(e.target.value)}  
            type="tel" 
            defaultValue={mobileNumber}
            placeholder="Enter Phone Number here..."
            className="w-[92%] max-sm:w-[85%]"
          />
        </div>
    </Card>

    <TvCards />

    </Tabs>
  )
}

export default SelectTvProvider
