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
import React from 'react'

const RecentTransactions = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('history')
        .select('*')
        .neq('type', EVENT_TYPE.wallet_fund)
        .order('created_at', { ascending: false })
        .limit(3)

  return (
    <>
        <div className=' flex flex-col gap-2'>
            <h1 className=' text-lg text-gray-950 dark:text-violet-100 font-semibold'>Recent Transactions</h1>
            <div className=' self-center w-full flex flex-col gap-y-3'>
                {
                    data?.map(item => (
                        <Card key={item?.id} className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:transition-all hover:opacity-65 peer peer-hover:opacity-75 peer-hover:transition-all hover:duration-300 peer-hover:duration-300'>
                            <div className='flex flex-row gap-x-2.5'>
                                <div className='w-10 h-10'>
                                    <Image 
                                        src={
                                            product[(JSON.parse(
                                                item.meta_data?.toString() ?? '{}'
                                            ) as AirtimeDataMetadata)?.network as Networks].image
                                        }
                                        alt={item?.title!}
                                        width={500}
                                        height={500}
                                        className='w-full h-full object-cover rounded-full'
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <h2 className='text-sm md:text-base tracking-tighter'>{item.title}</h2>
                                    <span className={cn("text-xs text-gray-500 dark:text-gray-400", {
                                        'line-through text-red-500 dark:text-red-4': item.status === 'failed',
                                        'dark:text-green-400 text--green-500': item.status === 'success'
                                    })}>{item.description}</span>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-1 justify-end items-end'>
                                {
                                    item.status === 'success' ? (
                                        <LucideCheck 
                                            className='text-green-500 dark:text-green-400'
                                            size={18}
                                        />
                                    ) : (
                                        <LucideX 
                                            className='text-red-500 dark:text-red-400' 
                                            size={18}
                                        />
                                    )
                                }
                                <span className='text-xs text-gray-500 dark:text-gray-400'>{formatDateTime(item.created_at)}</span>
                            </div>
                        </Card>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default RecentTransactions