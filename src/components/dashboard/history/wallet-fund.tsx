import { Card } from "@/components/ui/card"
import { formatNigerianNaira } from "@/funcs/formatCurrency"
import { Tables } from "@/types/database"
import { TransactionEvent } from "@/types/webhooks"
import { LucideCheckCircle2 } from "lucide-react"

interface WalletFundProps {
    data: TransactionEvent['eventData']
    type?: TransactionEvent['eventType']
    history: Tables<'history'>
}

export default function WalletFund ({ data, type, history }: WalletFundProps) {
    return( 
        <div className="flex flex-col gap-y-3">
            <div className='flex flex-col space-y-8 w-full'>
                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                    {history?.status === 'PAID' && <LucideCheckCircle2 className='text-green-600' size={40} />}
                    <h2 className='text-lg font-semibold'>{formatNigerianNaira(data.amountPaid as number)}</h2>
                    <h2 className='text-xl text-muted-foreground font-semibold'>{history.title}</h2>
                    <p className='text-muted-foreground text-xs md:text-sm'>{history?.description}</p>
                </Card>

                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                    <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Sender Details</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.paymentSourceInformation?.[0]?.accountNumber}</p>
                            <p>{data?.paymentSourceInformation?.[0]?.accountName}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Receiver Details</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.destinationAccountInformation?.accountNumber}</p>
                            <p>{data?.destinationAccountInformation?.bankName}</p>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <p className='text-muted-foreground basis-2/3'>Customer</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.customer?.name}</p>
                            <p>{data?.customer?.email}</p>
                        </div>
                    </div>
                </Card>
                </div>
        </div>
    )
}