import React from 'react'
import { Card } from '../../ui/card'
import { getTransactionHistory } from '@/lib/supabase/history'
import { Tables } from '@/types/database'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { ArrowUp, LucidePhone } from 'lucide-react'
import { formatDateTime } from '@/funcs/formatDate'
import { TransactionEvent } from '@/types/webhooks'
import Link from 'next/link'
import Empty from '../../Empty'
import TransactionHistoryItem from './TransactionHistoryItem'

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

export default TransactionHistoryComponent