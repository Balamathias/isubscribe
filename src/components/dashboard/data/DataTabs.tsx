'use client'

import React, { useState, useCallback, useMemo, lazy, Suspense, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { useNetwork } from '@/providers/data/sub-data-provider'
import SelectNetworkDropdown from '../SelectNetworkDropdown'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { verifyNumber } from '@/funcs/verifyNumber'
import CustomInput from '../CustomInput'
import DataTabsSkeleton from '@/components/skeletons/data-tabs'
import NetworkCardSkeleton from '@/components/loaders/network-card.skeleton'
import { Button } from '@/components/ui/button'
import { UsersIcon } from 'lucide-react'
import { parseNigerianPhoneNumber } from '@/lib/utils'

import useContacts from '@/hooks/use-contacts'

const DataNetworkCard = lazy(() => import('./DataNetworkCard'))
const DailyData = lazy(() => import('./DailyData'))

const tabs = [
    {
        name: 'Awoof',
        value: 'awoof',
        component: <DataNetworkCard />
    },
    {
        name: 'Regular',
        value: 'regular',
        component: <DailyData />
    },
]

const DataTabs = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0)
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

    useEffect(() => {
        if (contact) {
            const phoneNumber = parseNigerianPhoneNumber(contact?.phone)
            setMobileNumber(phoneNumber || '')
        }
    }, [contact, setMobileNumber])

    const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileNumber(e.target.value)
    }, [setMobileNumber])

    const tabsContent = useMemo(() => (
        <TabsContent 
            key={tabs[activeTabIndex].value} 
            value={tabs[activeTabIndex].value} 
            className="p-4 bg-white dark:bg-card/70 rounded-xl flex flex-col gap-y-2.5 shadow-sm"
        >
            <h2 className='text-muted-foreground text-lg font-semibold'>{tabs[activeTabIndex].name}</h2>
            <Suspense fallback={<NetworkCardSkeleton />}>
              {tabs[activeTabIndex].component}
            </Suspense>
        </TabsContent>
    ), [activeTabIndex])

    if (isPending) return <DataTabsSkeleton />

    return (
        <div className='flex-col gap-y-6 md:gap-y-10 max-sm:w-[90vw] w-[600px]'>
            <div className='flex flex-col gap-y-4 py-4'>
                <div className='flex flex-row gap-x-2 items-center'>
                    <SelectNetworkDropdown />
                    <CustomInput 
                        placeholder='Your Phone Number'
                        value={mobileNumber}
                        defaultValue={profile?.data?.phone || ''}
                        onChange={handleNumberChange}
                        name='phone'
                        className='shadow-sm'
                    />
                    <Button 
                        variant={'ghost'} 
                        size={'icon'}
                        onClick={async () => await importContact()}
                    >
                        <UsersIcon className='w-6 h-6' />
                    </Button>
                </div>
                {contact?.name && <span className='text-muted-foreground text-xs'>Contact: {contact?.name}</span>}
            </div>
        
            <Tabs defaultValue="awoof" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 gap-2 rounded-xl shadow-none border-none p-2 py-4 h-fit bg-transparent">
                    {tabs.map((tab, index) => (
                        <TabsTrigger 
                            key={tab.value} 
                            value={tab.value} 
                            className={`w-full h-9 md:text-lg text-xs data-[state=active]:bg-background/80 peer-hover:opacity-90 dark:data-[state=active]:text-violet-400/70 data-[state=active]:shadow-none bg-gray-50/80 dark:bg-card/70 data-[state=active]:ring md:data-[state=active]:ring shadow-sm rounded-full`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabsContent}
            </Tabs>
        </div>  
    )
}

export default DataTabs
