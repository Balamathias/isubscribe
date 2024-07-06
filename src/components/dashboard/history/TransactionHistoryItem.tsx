import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { formatDateTime } from '@/funcs/formatDate'
import { parseWithInterestPrice } from '@/funcs/priceToNumber'
import { ResponseData } from '@/lib/n3tdata/types'
import { Tables } from '@/types/database'
import { TransactionEvent } from '@/types/webhooks'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { ArrowUp, LucidePhone, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const TransactionHistoryItem = ({ transaction, type }: { 
    transaction: Tables<'history'>, 
    type: keyof typeof EVENT_TYPE 
}) => {
    const eventData = (JSON.parse(transaction?.meta_data?.toString() || '{}')) as TransactionEvent['eventData']
    const dataMetadata = (JSON.parse(transaction?.meta_data?.toString() || '{}')) as ResponseData

    if (type === 'wallet_fund') return <Wallet {...transaction} amount_={eventData?.amountPaid?.toString()!} />
    if (type === 'data_topup') return <Data {...transaction} amount_={dataMetadata?.amount!} />
    if (type === 'airtime_topup') return <Data {...transaction} amount_={dataMetadata?.amount!} />
    return (
    <></>
    )
}

const Wallet = ({id,...transaction}: Tables<'history'> & { amount_: string | number }) => {
    return (
        <Link href={'/dashboard/history/' + id} className='flex flex-row gap-x-2 items-center shadow-none border-none rounded-none last:border-none border-muted p-2 py-3 first:border-none hover:bg-violet-100 hover:transition-all hover:duration-300 w-full cursor-pointer justify-between border-b border'>
        <div className='flex items-center flex-row space-x-3'>
            <div className='flex items-center justify-center p-3 bg-violet-200 text-violet-950 rounded-full h-12 w-12'>
                <ArrowUp strokeWidth={2} className='text-primary' size={18} />
            </div>

            <div className='flex flex-col gap-y-1'>
                <p className='text-md font-semibold text-muted-foreground'>{transaction.title}</p>
                <p className='text-xs text-muted-foreground'>{formatDateTime(transaction.created_at)}</p>
            </div>
        </div>

        <div className='flex flex-col gap-y-1'>
            <p className='text-md font-semibold text-muted-foreground'>+{formatNigerianNaira(parseFloat(transaction.amount_?.toString()))}</p>
            {
                transaction.status === 'PAID' ? (
                    <span className="p-0.5 text-xs px-2 rounded-full bg-green-200 text-green-600">successful</span>
                ) : (
                    <span className="p-0.5 text-xs px-2 rounded-full bg-red-200 text-red-600">failed</span>
                )
            }
        </div>
    </Link>
    )
}

const Data = ({id,...transaction}: Tables<'history'> & { amount_: string }) => {
    return (
        <Link href={'/dashboard/history/' + id} className='flex flex-row gap-x-2 items-center shadow-none border-none rounded-none last:border-none border-muted p-2 py-3 first:border-none hover:bg-violet-100 hover:transition-all hover:duration-300 w-full cursor-pointer justify-between border-b border'>
        <div className='flex items-center flex-row space-x-3'>
            <div className='flex items-center justify-center p-3 bg-red-200 text-violet-950 rounded-full h-12 w-12'>
                <Phone strokeWidth={2} className='text-red-600' size={18} />
            </div>

            <div className='flex flex-col gap-y-1'>
                <p className='text-md font-semibold text-muted-foreground'>{transaction.title}</p>
                <p className='text-xs text-muted-foreground'>{formatDateTime(transaction.created_at)}</p>
            </div>
        </div>

        <div className='flex flex-col gap-y-1'>
            <p className='text-md font-semibold text-muted-foreground'>{formatNigerianNaira(parseWithInterestPrice(transaction.amount_?.toString(), 'nairaless'))}</p>
            {
                transaction?.status === 'success' ? (
                    <span className="p-0.5 text-xs px-2 rounded-full bg-green-200 text-green-600">successful</span>
                ) : (
                    <span className="p-0.5 text-xs px-2 rounded-full bg-red-200 text-red-600">failed</span>
                )
            }
        </div>
    </Link>
    )
}

export default TransactionHistoryItem
