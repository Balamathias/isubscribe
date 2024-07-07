import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { ResponseData } from '@/lib/n3tdata/types'
import { getSingleHistory } from '@/lib/supabase/history'
import { Tables } from '@/types/database'
import { TransactionEvent } from '@/types/webhooks'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react'
import React from 'react'

interface HistoryDetailProps {
    historyId: string
}

const HistoryDetail = async ({ historyId }: HistoryDetailProps) => {
  const { data: history } = await getSingleHistory(parseInt(historyId))
  const type = history.type as keyof typeof EVENT_TYPE

  const eventData = JSON.parse(history?.meta_data?.toString()! ?? '{}') as TransactionEvent['eventData']
  const dataMetadata = JSON.parse(history?.meta_data?.toString()! ?? '{}') as ResponseData

  return (
    <div className='flex flex-col space-y-4'>
      {type === 'airtime_topup' && <DataHistory history={history} dataMetadata={dataMetadata} />}
      {type === 'data_topup' && <DataHistory history={history} dataMetadata={dataMetadata} />}
      {type === 'wallet_fund' && <WalletHistory eventData={eventData} history={history} />}

      <Card className='rounded-xl shadow-none py-6 px-2 md:px-5 border-none drop-shadow-none flex items-center justify-between flex-row'>
        <Button
            variant={'destructive'}
            className='text-xs md:text-sm rounded-full'
            size={'lg'}
        >Download</Button>

        <Button
            variant={'default'}
            className='text-xs md:text-sm rounded-full'
            size={'lg'}
        >Print</Button>
      </Card>
    </div>
  )
}

const WalletHistory = ({ history, eventData }: { history: Tables<'history'>} & { eventData: TransactionEvent['eventData'] }) => {
    return (
        <div className='flex flex-col space-y-8 w-full'>

            <Card className='shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                {history?.status === 'PAID' && <LucideCheckCircle2 className='text-green-600' size={40} />}
                <h2 className='text-lg font-semibold'>{formatNigerianNaira(eventData.amountPaid as number)}</h2>
                <h2 className='text-xl text-muted-foreground font-semibold'>{history.title}</h2>
                <p className='text-muted-foreground text-xs md:text-sm'>{history?.description}</p>
            </Card>

            <Card className='shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Sender Details</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{eventData?.paymentSourceInformation?.[0]?.accountNumber}</p>
                        <p>{eventData?.paymentSourceInformation?.[0]?.accountName}</p>
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Receiver Details</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{eventData?.destinationAccountInformation?.accountNumber}</p>
                        <p>{eventData?.destinationAccountInformation?.bankName}</p>
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Customer</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{eventData?.customer?.name}</p>
                        <p>{eventData?.customer?.email}</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}


const DataHistory = ({ history, dataMetadata }: { history: Tables<'history'>} & { dataMetadata: ResponseData }) => {
    return (
        <div className='flex flex-col space-y-8 w-full'>

            <Card className='shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                {history?.status === 'success' ? <LucideCheckCircle2 className='text-green-600' size={40} /> :<LucideXCircle className='text-red-600' size={40} /> }
                <h2 className='text-lg font-semibold'>{formatNigerianNaira(history?.amount ?? 0)}</h2>
                <h2 className='text-xl text-muted-foreground font-semibold'>{history.title}</h2>
                <p className='text-muted-foreground text-xs md:text-sm'>{history?.description}</p>
            </Card>

            <Card className='shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Carrier Details</p>
                    <div className='flex flex-row space-x-1 items-center basis-1/3'>
                        <p>{dataMetadata?.network}</p>
                        <span>|</span>
                        <p>{dataMetadata?.dataplan ?? formatNigerianNaira(history?.amount ?? 0)}</p>
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Phone Number</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{dataMetadata?.phone_number}</p>
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Amount</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{formatNigerianNaira(history?.amount ?? 0)}</p>
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Transaction ID</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{dataMetadata?.transid}</p>
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Status</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        {
                            dataMetadata?.status === 'success' ? <p className='py-1 px-2 rounded-full bg-green-200 text-green-700 w-fit'>successful</p> : (
                                <p className='py-1 px-2 rounded-full bg-red-200 text-red-700 w-fit'>failed</p>
                            )
                        }
                    </div>
                </div>

                <div className='flex items-start justify-between'>
                    <p className='text-muted-foreground basis-2/3'>Plan Type</p>
                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                        <p>{dataMetadata?.plan_type}</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default HistoryDetail
