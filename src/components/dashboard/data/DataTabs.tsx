'use client'

import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { useNetwork } from '@/providers/data/sub-data-provider'
import SelectNetworkDropdown from '../SelectNetworkDropdown'
import { useGetProfile } from '@/lib/react-query/funcs/user'
// import DataNetworkCard from './DataNetworkCard'
// import DailyData from './DailyData'
import { useDebounce } from 'use-debounce'
import { verifyNumber } from '@/funcs/verifyNumber'
import CustomInput from '../CustomInput'
import DataTabsSkeleton from '@/components/skeletons/data-tabs'
import SimpleLoader from '@/components/loaders/simple-loader'

const DataNetworkCard = lazy(() => import('./DataNetworkCard'))
const DailyData = lazy(() => import('./DailyData'))

const tabs = [
    {
        name: 'Subs',
        value: 'hot',
        component: <DataNetworkCard />
    },
    {
        name: 'Daily',
        value: 'daily',
        component: <DailyData />
    },
    {
        name: 'Night',
        value: 'night',
        component: <DailyData type='night' />
    },
    {
        name: 'Weekend',
        value: 'weekend',
        component: <DailyData type='weekend' />
    },
    {
        name: 'Weekly',
        value: 'weekly',
        component: <DailyData type='weekly' />
    },
    {
        name: 'Monthly',
        value: 'monthly',
        component: <DailyData type='monthly' />
    },
    {
        name: 'Social',
        value: 'social',
        component: <DailyData type={'social' as any} />
    },
    {
        name: 'Special',
        value: 'special',
        component: <DailyData type='special' />
    },
]

const DataTabs = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const { mobileNumber, setMobileNumber, setCurrentNetwork } = useNetwork()
    const { data: profile, isPending } = useGetProfile()

    const [debouncedNumber] = useDebounce(mobileNumber, 4000)

    const handleVerifyNumber = useCallback(async () => {
        if (mobileNumber.length === 11) {
            const res = await verifyNumber(mobileNumber)
            if (res) setCurrentNetwork(res)
        }
    }, [mobileNumber, setCurrentNetwork])

    const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileNumber(e.target.value)
    }, [setMobileNumber])

    const tabsContent = useMemo(() => (
        <TabsContent 
            key={tabs[activeTabIndex].value} 
            value={tabs[activeTabIndex].value} 
            className="p-4 bg-white dark:bg-card/80 rounded-xl flex flex-col gap-y-2.5 shadow-none"
        >
            <h2 className='text-muted-foreground text-lg font-semibold'>{tabs[activeTabIndex].name}</h2>
            <Suspense fallback={<SimpleLoader />}>
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
                        onKeyDown={handleVerifyNumber}
                        name='phone'
                    />
                </div>
            </div>
            <Tabs defaultValue="hot" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 gap-2 rounded-xl shadow-none border-none p-2 py-4 h-fit bg-transparent">
                    {tabs.map((tab, index) => (
                        <TabsTrigger 
                            key={tab.value} 
                            value={tab.value} 
                            className={`w-full h-9 md:text-lg text-xs rounded-none data-[state=active]:bg-background/80 peer-hover:opacity-90 dark:data-[state=active]:text-violet-500/70 data-[state=active]:shadow-none bg-gray-50/80 dark:bg-card/90 data-[state=active]:border-b-2 md:data-[state=active]:border-b-4 data-[state=active]:border-violet-600 data-[state=active]:shadow-none bg-gray-50/80 rounded-md`}
                            onClick={() => setActiveTabIndex(index)}
                            hidden={tab.name === 'Special'}
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
