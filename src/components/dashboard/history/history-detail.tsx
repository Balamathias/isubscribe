'use client'

import usePrint from '@/hooks/usePrint'
import useScreenshot from '@/hooks/useScreenshot'
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

interface HistoryDetailProps {
    history: Tables<'history'>
}

const HistoryDetail = ({ history }: HistoryDetailProps) => {
    const [action, setAction] = React.useState<'download' | 'print'>('download')
    const { ref, takeScreenshot } = useScreenshot()
    const { ref: printRef, printDiv } = usePrint()

  const type = history.type as keyof typeof EVENT_TYPE

  
  switch (type) {
      
    case 'wallet_fund':
        const walletFund = JSON.parse(history?.meta_data?.toString()! ?? '{}') as TransactionEvent['eventData']
        return <WalletFund 
            data={walletFund}
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
        return <TVTopup />

    case 'meter_topup':
        return <MeterTopup />

    case 'debit_funds':
        return <></>
    case 'wallet_fund_failed':
        return <></>
    default:
        return <></>
  }

//   return (
//     <div className='flex flex-col space-y-4 rounded-lg pb-4' ref={ action === 'download' ? ref : printRef }>
//         <Logo />
//       {type === 'airtime_topup' && <DataHistory history={history} dataMetadata={dataMetadata} />}
//       {type === 'data_topup' && <DataHistory history={history} dataMetadata={dataMetadata} />}
//       {type === 'wallet_fund' && <WalletHistory eventData={eventData} history={history} />}

//       <Card className='rounded-xl shadow-none py-6 px-2 md:px-5 border-none drop-shadow-none flex items-center justify-between flex-row dark:bg-card/80'>
//         <Button
//             variant={'destructive'}
//             className='text-xs md:text-sm rounded-full'
//             size={'lg'}
//             onClick={() => {
//                     setAction('download')
//                     takeScreenshot()
//                 }}
//                 >Download</Button>

//         <Button
//             variant={'default'}
//             className='text-xs md:text-sm rounded-full'
//             size={'lg'}
//             onClick={() => {
//                 setAction('print')
//                 printDiv()
//             }}
//         >Print</Button>
//       </Card>
//     </div>
//   )
}

export default HistoryDetail