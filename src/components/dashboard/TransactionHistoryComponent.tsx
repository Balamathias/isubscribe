import React from 'react'
import { Card } from '../ui/card'
import { getTransactionHistory } from '@/lib/supabase/history'
import { Tables } from '@/types/database'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { ArrowUp, LucidePhone } from 'lucide-react'
import { formatDateTime } from '@/funcs/formatDate'
import { TransactionEvent } from '@/types/webhooks'
import Link from 'next/link'
import Empty from '../Empty'

const TransactionHistoryComponent = async () => {
    const { data: history } = await getTransactionHistory()

    if (!history || history.length === 0) {
        return (
        <Empty 
            title='No Transactions Yet'
            content='You have not taken any action yet, and that is why there is nothing here. You can start by either funding your wallet or toping up Airtime or Data.'
        />)
    }

  return (
    <Card className='py-3 rounded-xl shadow-none drop-shadow-none border-none flex flex-col w-full space-y-2'>
        {
            history?.map((transaction, index) => (
                <TransactionHistoryItem key={index} transaction={transaction} type={transaction.type as keyof typeof EVENT_TYPE} />
            ))
        }
    </Card>
  )
}

const TransactionHistoryItem = ({ transaction, type }: { 
    transaction: Tables<'history'>, 
    type: keyof typeof EVENT_TYPE 
}) => {
    const eventData = (JSON.parse(transaction?.meta_data?.toString() || '{}')) as TransactionEvent['eventData']

    return (
    <Link href={'/dashboard/history/' + transaction?.id} className='flex flex-row gap-x-2 items-center shadow-none border-none rounded-none last:border-none border-muted p-2 py-3 first:border-none hover:bg-violet-100 hover:transition-all hover:duration-300 w-full cursor-pointer justify-between border-b border'>
        <div className='flex items-center flex-row space-x-3'>
            <div className='flex items-center justify-center p-3 bg-violet-200 text-violet-950 rounded-full h-12 w-12'>
                {
                    type === 'wallet_fund' ? (
                        <ArrowUp strokeWidth={2} className='text-primary' size={18} />
                    ) : (
                        <LucidePhone size={24} />
                    )
                }
            </div>

            <div className='flex flex-col gap-y-1'>
                <p className='text-md font-semibold text-muted-foreground'>{transaction.title}</p>
                <p className='text-xs text-muted-foreground'>{formatDateTime(transaction.created_at)}</p>
            </div>
        </div>

        <div className='flex flex-col gap-y-1'>
            <p className='text-md font-semibold text-muted-foreground'>+N{eventData?.amountPaid}</p>
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

export default TransactionHistoryComponent
