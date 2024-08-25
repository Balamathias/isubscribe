import Status from "@/components/status"
import { formatDateTime } from "@/funcs/formatDate"
import { Tables } from "@/types/database"

interface TVTopupProps {
    history: Tables<'history'>,
}

export default function TVTopup ({ history }: TVTopupProps) {
    const metadata = JSON.parse(history?.meta_data?.toString()! ?? '{}') as any
    console.log(metadata)
    return (
        <div className="flex flex-col gap-y-3">
            <div className='flex flex-col bg-card/70 rounded-xl justify-center items-center gap-y-1 p-4'>
                <Status status={history?.status as Status} type={'image'} />
                <h2 className='text-xl text-muted-foreground font-semibold text-center'>{history.title}</h2>
                <p className='text-muted-foreground text-xs md:text-sm text-center'>{history?.description}</p>
                <p className='text-muted-foreground text-xs md:text-sm text-center'>{formatDateTime(history?.created_at)}</p>
            </div>

            <div className="flex flex-col space-y-3">
                
            </div>
        </div>
    )
}