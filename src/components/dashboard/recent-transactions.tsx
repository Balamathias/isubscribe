import { Card } from '@/components/ui/card'
import { formatDateTime } from '@/funcs/formatDate'
import { cn } from '@/lib/utils'
import { AirtimeDataMetadata } from '@/types/airtime-data'
import { Networks } from '@/types/networks'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { product } from '@/utils/constants/product'
import { createClient } from '@/utils/supabase/server'
import { LucideCheck, LucideX } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import HistoryItem from './history-item'
import Empty from '../Empty'

const RecentTransactions = async () => {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()

    const { data } = await supabase.from('history')
        .select('*')
        .eq('user', user?.user?.id!)
        .order('created_at', { ascending: false })
        .limit(3)

  return (
    <>
        <div className=' flex flex-col gap-2'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className=' md:text-lg text-base text-gray-950 dark:text-violet-100 font-semibold peer'>Recent Transactions</h1>
                <Link href={'/dashboard/history'} className='md:text-base text-sm hover:text-amber-500 hover:underline hover:transition-all hover:duration-500 peer-hover:opacity-65'>
                    See All
                </Link>
            </div>
            <div className=' self-center w-full flex flex-col gap-y-3'>
                {
                    data?.length === 0 ? (
                    <Empty 
                        title='No recent Transactions.'
                        content={'You haven\'t carried out any transaction on iSubscribe yet. You can start by buying Airtime or Data bundle(s),'}
                    />) : data?.map(item => (
                        <HistoryItem 
                            key={item.id}
                            item={item}
                        />
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default RecentTransactions