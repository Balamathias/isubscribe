import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { Tables } from '@/types/database'
import React from 'react'
import PleaseSignIn from '../please-sign-in.modal'

interface NetworkCardItemProps {
    dataQty: string,
    dataDuration: string,
    dataPrice: number,
    dataCashBack: number,
    handler: () => void,
    profile?: Tables<'profile'> | null
}

const NetworkCardItem = ({
    dataCashBack,
    dataDuration,
    dataPrice,
    dataQty,
    handler,
    profile
}: NetworkCardItemProps) => {
  return (
    <>
        {
            profile ? (
                <Card
                    className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all"
                    onClick={handler}
                >
                    <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                        <p className="font-semibold text-base">{dataQty}</p>
                        <p>{dataDuration}</p>
                        <p>{formatNigerianNaira(dataPrice)}</p>
                        <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                            <span>+{formatDataAmount(dataCashBack * DATA_MB_PER_NAIRA)}</span>
                            <span className='sr-only'>Data bonus</span>
                        </div>
                    </div>
                </Card>
            ): (
                <PleaseSignIn 
                    trigger={
                        <Card
                            className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all"
                            onClick={undefined}
                        >
                            <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                                <p className="font-semibold text-base">{dataQty}</p>
                                <p>{dataDuration}</p>
                                <p>{formatNigerianNaira(dataPrice)}</p>
                                <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                                    <span>+{formatDataAmount(dataCashBack * DATA_MB_PER_NAIRA)}</span>
                                    <span className='sr-only'>Data bonus</span>
                                </div>
                            </div>
                        </Card>
                    }
                />
            )
        }
    </>
  )
}

export default NetworkCardItem