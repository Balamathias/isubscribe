import { Switch } from '@/components/ui/switch'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { AlertTriangle, LucideAlertTriangle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface ConfirmProductInfoProps {
    currentNetwork: string
    mobileNumber: string
    price: number,
    dataQty: string,
    dataDuration: string,
    cashBack: number,
    image: string,
    title?: string,
    planName?: string,
    planType?: string
}

const ConfirmProductInfo = ({
    currentNetwork,
    mobileNumber,
    price,
    dataQty,
    dataDuration,
    cashBack,
    image,
    title,
    planName,
    planType
}: ConfirmProductInfoProps) => {
  return (
    <div className="flex flex-col gap-y-2.5 w-full">
        <h1 className="md:text-lg text-base md:text-start text-center font-semibold hidden text-violet-700 dark:text-violet-400 py-2">{title || 'Data Plan Details'}</h1>
        
        <div className='flex flex-col gap-y-2 p-3 rounded-lg bg-violet-100 text-xs md:text-sm dark:bg-inherit'>
            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Product</p>
                <p className='flex items-center flex-row gap-x-1'>{currentNetwork.toUpperCase()} | 

                    <Image
                        src={image}
                        width={20}
                        height={20}
                        quality={100}
                        alt={currentNetwork}
                        className='h-7 w-7 rounded-full object-cover' 
                    />
                </p>
            </div>

            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Phone Number</p>
                <p>{mobileNumber}</p>
            </div>

            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Price</p>
                <p>{formatNigerianNaira(price)}</p>
            </div>

            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Amount</p>
                <p>{dataQty}</p>
            </div>

            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Duration</p>
                <p>{dataDuration === '72 hrs' ? "-" : dataDuration}</p>
            </div>

            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Data Bonus</p>
                <p className='px-2 py-1 rounded-full bg-violet-700/15'>+{formatDataAmount(cashBack * DATA_MB_PER_NAIRA)}</p>
            </div>

            {planName && <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Plan Name</p>
                <p>{planName}</p>
            </div>}

            {planType && <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Plan Type</p>
                <p>{planType}</p>
            </div>}

            {
                planType === 'COOPERATE GIFTING' && currentNetwork === 'airtel' && (
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <span className=''>
                        <LucideAlertTriangle className='text-amber-500/80 w-5 h-5' />
                    </span>
                    <span className='text-muted-foreground text-xs'>Cooperate gifting for airtel may not be available.</span>
                </div>
                )
            }

            {
                (currentNetwork === 'airtel' && planType === 'GIFTING') && (
                    <div className='p-4 rounded-xl border border-amber-500/70 flex justify-center text-amber-500/70 gap-x-1.5'>
                        <span className='basis-[20%]'>
                            <AlertTriangle />
                        </span>
                        <span className='text-xs'>Confirm that the receiver of this plan does not owe airtel in anyway as Airtel will not credit the receiver for &#39;{planType}&#39; plan type. This only happens on airtel {planType} plan.</span>
                        <span className='basis-[20%]'>
                            <Switch 
                                title={`I confirm!`}
                            />
                        </span>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default ConfirmProductInfo