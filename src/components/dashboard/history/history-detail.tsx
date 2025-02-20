import { AirtimeDataMetadata } from '@/types/airtime-data'
import { Tables } from '@/types/database'
import { TransactionEvent } from '@/types/webhooks'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import React from 'react'
import WalletFund from './wallet-fund'
import DataTopup from './data-topup'
import AirtimeTopup from './airtime-topup'
import TVTopup from './tv-topup'
import MeterTopup from './meter-topup'
import Education from './education'
import CashbackHistory from './cashback.history'
import TransferHistory from './transfer'

interface HistoryDetailProps {
    history: Tables<'history'>
}

const HistoryDetail = async ({ history }: HistoryDetailProps) => {

  const type = history.type as keyof typeof EVENT_TYPE
  
  switch (type) {
      
    case 'wallet_fund':
        const walletFund = JSON.parse(history?.meta_data?.toString()! ?? '{}') as TransactionEvent['eventData']
        return <WalletFund 
            data={walletFund}
            history={history!}
        />

    case 'money_transfer':
        const transfer = JSON.parse(history?.meta_data?.toString()! ?? '{}') as any
        return <TransferHistory 
            data={transfer}
            history={history!}
        />
          
    case 'data_topup':
        const dataMetadata = JSON.parse(history?.meta_data?.toString()! ?? '{}') as AirtimeDataMetadata
        return <DataTopup 
            history={history}
            data={dataMetadata}
        />

    case 'airtime_topup':
        const airtimeMetadata = JSON.parse(history?.meta_data?.toString()! ?? '{}') as AirtimeDataMetadata
        return <AirtimeTopup 
            history={history}
            data={airtimeMetadata}
        />

    case 'tv_topup':
        return <TVTopup history={history} />

    case 'meter_topup':
        return <MeterTopup 
            history={history}
        />

    case 'education_topup':
        return <Education
            history={history}
        />

    case 'debit_funds':
        return <></>
    case 'wallet_fund_failed':
        return <></>
    case 'cashback':
        return <CashbackHistory history={history} />
    default:
        return <></>
  }
}

export default HistoryDetail