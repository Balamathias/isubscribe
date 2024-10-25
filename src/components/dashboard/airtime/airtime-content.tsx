'use client'

import React from 'react'
import { Input } from '../../ui/input'
import { useNetwork } from '@/providers/data/sub-data-provider'
import SelectNetworkDropdown from '../SelectNetworkDropdown'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { verifyNumber } from '@/funcs/verifyNumber'
import AirtimeCards from './airtime-cards-v2'
import { useCallback, useEffect } from 'react'
import { Button } from '../../ui/button'

import useContacts from '@/hooks/use-contacts'

import { UsersIcon } from 'lucide-react'
import { parseNigerianPhoneNumber } from '@/lib/utils'


const AirtimeContent = () => {

    const { mobileNumber, setMobileNumber, setCurrentNetwork } = useNetwork()
    const { data: profile, isPending } = useGetProfile()

    const { contact, importContact } = useContacts()

    const handleVerifyNumber = useCallback(async () => {
        if (mobileNumber.length === 11) {
            const res = await verifyNumber(mobileNumber)
            if (res) setCurrentNetwork(res)
        }
    }, [mobileNumber, setCurrentNetwork])

    useEffect(() => {
        handleVerifyNumber()
    }, [mobileNumber, handleVerifyNumber])

    const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileNumber(e.target.value)
    }, [setMobileNumber])

    useEffect(() => {
        if (contact) {
            const phoneNumber = parseNigerianPhoneNumber(contact?.phone?.toString())
            setMobileNumber(phoneNumber || '')
        }
    }, [contact, setMobileNumber])

    if (isPending) return <LoadingOverlay />

  return (
    <div className='flex-col gap-y-6 md:gap-y-10 max-sm:w-[90vw] w-[600px]'>
        <div className='flex flex-col gap-y-4 py-4'>
            <div className='flex flex-row gap-x-2 items-center'>
                <SelectNetworkDropdown />
                <Input 
                    placeholder='Your Phone Number'
                    className='focus-within:outline h-12 bg-white dark:bg-secondary dark:border dark:border-muted-foreground items-center focus:ring-0 dark:focus:ring-1 dark:focus:ring-amber-500 focus-within:ring-0 rounded-lg border-none shadow-sm drop-shadow-none'
                    value={mobileNumber}
                    defaultValue={profile?.data?.phone || ''}
                    onChange={handleNumberChange}
                    name='phone'
                />
                <Button 
                    variant={'ghost'} 
                    size={'icon'}
                    onClick={importContact}
                    className="hover:bg-transparent focus:bg-transparent hover:opacity-80 transition-all"
                >
                    <UsersIcon className='w-6 h-6' />
                </Button>
            </div>
            {contact?.name && <span className='text-muted-foreground text-xs'>@{contact?.name}</span>}
        </div>
      <section className="flex flex-col space-y">
        <AirtimeCards />
      </section>
    </div>
  )
}

export default AirtimeContent
