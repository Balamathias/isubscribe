import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { AirtimeDataMetadata } from '@/types/airtime-data'
import { Tables } from '@/types/database'
import { Networks } from '@/types/networks'
import { product } from '@/utils/constants/product'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import Status from '../status'
import { Status as StatusType } from '@/types/constants'
import { formatTimestamp } from '@/funcs/formatDate'

const HistoryItem = ({item, className}: { item: Tables<'history'>, className?: string}) => {

    const getItemImage = (type: keyof typeof EVENT_TYPE) => {
        switch (type) {
            case EVENT_TYPE.wallet_fund:
                return product[EVENT_TYPE.wallet_fund].image
            case EVENT_TYPE.meter_topup:
                return product[EVENT_TYPE.meter_topup].image
            case EVENT_TYPE.education_topup:
                return product[EVENT_TYPE.education_topup].image
            case EVENT_TYPE.tv_topup:
                return product[EVENT_TYPE.tv_topup].image
            case EVENT_TYPE.cashback:
                return product[EVENT_TYPE.cashback].image
            default:
                return product[(JSON.parse(
                    item.meta_data?.toString() ?? '{}'
                ) as AirtimeDataMetadata)?.network as Networks]?.image
        }
    }

    const paidToStatus = (status: string): Status => (status === 'PAID' ? 'success' : status) as Status

  return (
    <Link href={'/dashboard/history/' + item.id} key={item?.id} className={cn('flex flex-row justify-between items-center space-y-3 bg-card dark:bg-card/60 rounded-xl p-4 border-none shadow-none outline-none cursor-pointer hover:transition-all hover:opacity-65 peer peer-hover:opacity-75 peer-hover:transition-all hover:duration-300 peer-hover:duration-300', className)}>
        <div className='flex flex-row gap-x-2.5'>
            <div className='md:w-10 md:h-10 w-8 h-8  aspect-square rounded-full block'>
                <Image 
                    src={getItemImage(item.type as keyof typeof EVENT_TYPE)}
                    alt={item?.title!}
                    width={500}
                    height={500}
                    className='object-cover w-full h-full rounded-full'
                />
            </div>
            <div className="flex flex-col space-y-1 basis-[80%]">
                <h2 className='text-xs md:text-base tracking-tighter'>{item.title ==='Cashback' ? 'Data Bonus' : item.title}</h2>
                <span className={cn("text-[10px] md:text-xs text-gray-500 dark:text-gray-400", {
                    'text-muted-foreground/70': item.status === 'failed',
                    'text-muted-foreground': item.status === 'success'
                })}>{formatTimestamp(item?.created_at)}.</span>
            </div>
        </div>
        <div className='flex flex-col space-y-1 justify-end items-end basis-[12%]'>
            <Status status={paidToStatus(item?.status!) as StatusType} />
            <span className='text-xs text-gray-500 dark:text-gray-400'>{item?.type === EVENT_TYPE.cashback ? formatDataAmount(item?.amount! * DATA_MB_PER_NAIRA) : formatNigerianNaira(item?.amount!)}</span>
        </div>
    </Link>
  )
}

export default HistoryItem