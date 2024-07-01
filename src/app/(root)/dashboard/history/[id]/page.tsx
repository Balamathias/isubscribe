import WidthWrapper from '@/components/WidthWrapper'
import { Card } from '@/components/ui/card'
import { getSingleHistory } from '@/lib/supabase/history'
import { TransactionEvent } from '@/types/webhooks'
import { LucideCheckCircle2 } from 'lucide-react'
import React from 'react'

const HistoryDetailPage = async ({ params }: { params: { id: string } }) => {
  const { data: history } = await getSingleHistory(parseInt(params.id))
  const eventData = JSON.parse(history?.meta_data?.toString()! ?? '{}') as TransactionEvent['eventData']
  return (
    <WidthWrapper className='mt-16 !max-w-3xl w-full'>
        <div className='flex flex-col space-y-8 w-full'>

            <Card className='shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                {history?.status === 'PAID' && <LucideCheckCircle2 className='text-green-600' size={40} />}
                <h2 className='text-lg font-semibold'>+N{eventData?.amountPaid}</h2>
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
    </WidthWrapper>
  )
}

export default HistoryDetailPage
