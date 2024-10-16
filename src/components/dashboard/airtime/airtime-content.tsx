'use client'

import React from 'react'
import { Input } from '../../ui/input'
import { useNetwork } from '@/providers/data/sub-data-provider'
import SelectNetworkDropdown from '../SelectNetworkDropdown'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { verifyNumber } from '@/funcs/verifyNumber'
import AirtimeCards from './airtime-cards-v2'
const AirtimeContent = () => {

    const { mobileNumber, setMobileNumber, setCurrentNetwork } = useNetwork()
    const { data: profile, isPending } = useGetProfile()

    const className = `w-full h-9 md:text-lg text-xs rounded-none data-[state=active]:bg-background peer-hover:opacity-90 data-[state=active]:text-violet-800 data-[state=active]:border-b-2 md:data-[state=active]:border-b-4 data-[state=active]:border-violet-600 data-[state=active]:shadow-none bg-gray-50/80 rounded-md`

    const handleVerifyNumber = async () => {
        if (mobileNumber.length === 11) {
            const res = await verifyNumber(mobileNumber)
            if (!res) return
            setCurrentNetwork(res)
        }
    }

    if (isPending) return <LoadingOverlay />

  return (
    <div className='flex-col gap-y-6 md:gap-y-10 max-sm:w-[90vw] w-[600px]'>
        <div className='flex flex-col gap-y-4 py-4'>
            <div className='flex flex-row gap-x-2 items-center'>
                <SelectNetworkDropdown />
                <Input 
                    placeholder='Your Phone Number'
                    className='focus-within:outline h-12 bg-white dark:bg-secondary dark:border dark:border-muted-foreground items-center focus:ring-0 dark:focus:ring-1 dark:focus:ring-amber-500 focus-within:ring-0 rounded-lg border-none shadow-none drop-shadow-none'
                    value={mobileNumber}
                    defaultValue={profile?.data?.phone || ''}
                    onChange={ async (e) => {
                        setMobileNumber(e.target.value)
                    }}
                    onKeyDown={async (e) => {
                        await handleVerifyNumber()
                    }}
                    name='phone'
                />
            </div>
        </div>
      <section className="flex flex-col space-y">
        <AirtimeCards />
      </section>
    </div>
  )
}

export default AirtimeContent
