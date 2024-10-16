import { formatNigerianNaira } from '@/funcs/formatCurrency'
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
    title?: string
}

const ConfirmProductInfo = ({
    currentNetwork,
    mobileNumber,
    price,
    dataQty,
    dataDuration,
    cashBack,
    image,
    title
}: ConfirmProductInfoProps) => {
  return (
    <div className="flex flex-col gap-y-2.5 w-full">
        <h1 className="md:text-lg text-base md:text-start text-center font-semibold text-violet-700 dark:text-violet-400 py-2">{title || 'Data Plan Details'}</h1>
        
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
                <p>{dataDuration}</p>
            </div>

            <div className='flex flex-row justify-between items-center gap-x-2'>
                <p className='font-semibold text-muted-foreground'>Cashback</p>
                <p className='px-2 py-1 rounded-full bg-violet-700/15'>+{formatNigerianNaira(cashBack)}</p>
            </div>
        </div>
    </div>
  )
}

export default ConfirmProductInfo