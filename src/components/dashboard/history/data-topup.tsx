import Status from "@/components/status"
import { Card } from "@/components/ui/card"
import { formatNigerianNaira } from "@/funcs/formatCurrency"
import { AirtimeDataMetadata } from "@/types/airtime-data"
import type { Status as StatusType } from "@/types/constants"
import { Tables } from "@/types/database"
import { LucideCheckCircle2, LucideXCircle } from "lucide-react"

interface DataTopupProps {
    data: AirtimeDataMetadata
    history: Tables<'history'>
}

export default function DataTopup ({data, history}: DataTopupProps) {
    return (
        <div className="flex flex-col gap-y-3">
            <div className='flex flex-col space-y-8 w-full'>
                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                    {history?.status === 'success' ? <LucideCheckCircle2 className='text-green-500' size={40} /> :<LucideXCircle className='text-red-500' size={40} /> }
                    <h2 className='text-lg font-semibold'>{formatNigerianNaira(history?.amount ?? 0)}</h2>
                    <h2 className='text-xl text-muted-foreground font-semibold'>{history.title}</h2>
                    <p className='text-muted-foreground text-xs md:text-sm'>{history?.description}</p>
                </Card>

                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                    <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Carrier Details</p>
                        <div className='flex flex-row space-x-1 items-center basis-1/3'>
                            <p>{data?.network}</p>
                            <span>|</span>
                            <p>{formatNigerianNaira(history?.amount ?? 0)}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Phone Number</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.phone}</p>
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
                            <p>{data?.transId}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Status</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <Status status={history.status as StatusType} />
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Plan Type</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.planType}</p>
                        </div>
                    </div>
                </Card>
                </div>
        </div>
    )
}