'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Input } from '../../ui/input'
import { useNetwork } from '@/providers/data/sub-data-provider'
import SelectNetworkDropdown from '../SelectNetworkDropdown'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import DataNetworkCard from './DataNetworkCard'
import DailyData from './DailyData'
import { useDebounce } from 'use-debounce'
import { verifyNumber } from '@/funcs/verifyNumber'
import { Networks } from '@/types/networks'

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

    const [activeTabIndex, setActiveTabIndex] = React.useState(0)
    const { mobileNumber, setMobileNumber, setCurrentNetwork } = useNetwork()
    const { data: profile, isPending } = useGetProfile()

    const debouncedNumber = useDebounce(mobileNumber, 4000)

    const handleVerifyNumber = async () => {
        if (mobileNumber.length === 11) {
            const res = await verifyNumber(mobileNumber)
            if (!res) return
            setCurrentNetwork(res)
        }
    }

    const className = `w-full h-9 md:text-lg text-xs rounded-none data-[state=active]:bg-background peer-hover:opacity-90 data-[state=active]:text-violet-800 data-[state=active]:border-b-2 md:data-[state=active]:border-b-4 data-[state=active]:border-violet-600 data-[state=active]:shadow-none bg-gray-50/80 rounded-md`

    if (isPending) return <LoadingOverlay />

  return (
    <div className='flex-col gap-y-6 md:gap-y-10 max-sm:w-[90vw] w-[600px]'>
        <div className='flex flex-col gap-y-4 py-4'>
            <div className='flex flex-row gap-x-2 items-center'>
                <SelectNetworkDropdown />
                <Input 
                    placeholder='Your Phone Number'
                    className='focus-within:outline h-12 bg-white items-center focus:ring-0 focus-within:ring-0 rounded-lg border-none shadow-none drop-shadow-none'
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
      <Tabs defaultValue="hot" className=" space-y-6 ">

        <TabsList className="grid w-full grid-cols-4 gap-2 rounded-xl shadow-none border-none p-2 py-4 h-fit bg-transparent">
            {tabs.map((tab, index) => (
                <TabsTrigger 
                    key={tab.value} 
                    value={tab.value} 
                    className={className} 
                    onClick={() => setActiveTabIndex(index)}
                    hidden={tab.name === 'Special'}
                >
                {tab.name}
                </TabsTrigger>
            ))}
        </TabsList>

        <TabsContent key={tabs[activeTabIndex].value} value={tabs[activeTabIndex].value} className="p-4 bg-white rounded-xl flex flex-col gap-y-2.5 shadow-none">
            <h2 className='text-muted-foreground text-lg font-semibold'>{tabs[activeTabIndex].name}</h2>
            {tabs[activeTabIndex].component}
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default DataTabs
