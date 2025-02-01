import Status from "@/components/status"
import { Card } from "@/components/ui/card"
import { formatNigerianNaira } from "@/funcs/formatCurrency"
import { formatDateTime } from "@/funcs/formatDate"
import { Tables } from "@/types/database"
import { TransactionEvent } from "@/types/webhooks"
import { LucideCheckCircle2 } from "lucide-react"

interface TransferHistoryProps {
    data: Record<string, any>
    type?: TransactionEvent['eventType']
    history: Tables<'history'>
}

export default function TransferHistory ({ data, type, history }: TransferHistoryProps) {
    return( 
        <div className="flex flex-col gap-y-3">
            <div className='flex flex-col space-y-8 w-full'>
                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                    <Status type="icon" status={(history?.status === 'PAID' || history?.status === 'success') ? 'success' : 'failed'} />
                    <h2 className='text-lg font-semibold'>{formatNigerianNaira(history.amount as number)}</h2>
                    <h2 className='text-xl text-muted-foreground font-semibold text-center'>{history.title}</h2>
                    <p className='text-muted-foreground text-xs md:text-sm text-center'>{history?.description}</p>
                    <p className='text-muted-foreground text-xs md:text-sm text-center'>{formatDateTime(history?.created_at)}</p>
                </Card>

                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                    <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Sender Details</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.sender_name}</p>
                            <p>{data?.sender_email}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Receiver Details</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.recipient_name}</p>
                            <p>{data?.recipient_email}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Customer</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.sender_name}</p>
                            <p>{data?.sender_email}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3 font-semibold'>Transaction REF</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p className="text-primary">{history.transaction_id ?? data?.transactionReference}</p>
                        </div>
                    </div>
                </Card>
                </div>
        </div>
    )
}