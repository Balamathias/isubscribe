import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { Tables } from '@/types/database'
import React from 'react'
import PleaseSignIn from '../please-sign-in.modal'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { LucideAlertTriangle } from 'lucide-react'
import DynamicModal from '@/components/DynamicModal'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface NetworkCardItemProps {
    dataQty: string,
    dataDuration: string,
    dataPrice: number,
    dataCashBack: number,
    handler: () => void,
    profile?: Tables<'profile'> | null,
    type?: string,
    isActive?: boolean
}

const NetworkCardItem = ({
    dataCashBack,
    dataDuration,
    dataPrice,
    dataQty,
    handler,
    profile,
    type,
    isActive=true
}: NetworkCardItemProps) => {
    const { currentNetwork } = useNetwork()
  return (
    <>
        {
            profile ? (
                isActive ? (
                    <Card
                        className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all relative"
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
                            {
                                type === 'COOPERATE GIFTING' && currentNetwork === 'airtel' && (
                                    <span className='absolute left-1 top-2'>
                                        <LucideAlertTriangle className='text-amber-500/80 w-4 h-4 sm:w-5 sm:h-5' />
                                    </span>
                                )
                            }
                        </div>
                    </Card>
                ): (
                    <DynamicModal
                        hideDrawerCancel
                        trigger={
                            <Card
                                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all relative"
                            >
                                <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                                    <p className="font-semibold text-base">{dataQty}</p>
                                    <p>{dataDuration}</p>
                                    <p>{formatNigerianNaira(dataPrice)}</p>
                                    <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                                        <span>+{formatDataAmount(dataCashBack * DATA_MB_PER_NAIRA)}</span>
                                        <span className='sr-only'>Data bonus</span>
                                    </div>
                                    {
                                        (
                                            <span className='absolute left-[3px] sm:left-1 sm:top-2 top-2.5'>
                                                <LucideAlertTriangle className='text-amber-500/60 w-4 h-4 sm:w-5 sm:h-5' />
                                            </span>
                                        )
                                    }
                                </div>
                            </Card>
                        }
                    >
                        <div className="flex flex-col items-center justify-center p-6 w-full">
                            <div className="flex flex-col items-center gap-y-4 max-w-sm">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-violet-500/20 rounded-full blur"></div>
                                    <ExclamationTriangleIcon className="w-6 h-6 text-violet-500 dark:text-violet-400 relative" />
                                </div>
                                
                                <h3 className="text-lg font-semibold text-muted-foreground mt-2">
                                    Plan Unavailable right now
                                </h3>
                                
                                <p className="text-center text-sm text-muted-foreground leading-relaxed">
                                    We're currently working on making this plan available. Please check back later or explore our other available options.
                                </p>

                                <SheetClose asChild>
                                    <Button 
                                        className='w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white' 
                                        size={'lg'}
                                    >
                                        Close
                                    </Button>
                                </SheetClose>
                            </div>
                        </div>
                    </DynamicModal>
                )
            ): (
                <PleaseSignIn 
                    message='Please sign in to buy data'
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