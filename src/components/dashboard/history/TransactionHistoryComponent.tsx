import React from 'react'
import { getTransactionHistory } from '@/lib/supabase/history'
import Empty from '../../Empty'
import HistoryItem from '../history-item'

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
    <div className=' self-center w-full flex flex-col gap-y-3'>
        {
            history?.map(item => (
                <HistoryItem 
                    key={item.id}
                    item={item}
                />
            ))
        }
    </div>
  )
}

export default TransactionHistoryComponent