'use client'

import { cn } from '@/lib/utils'
import { PaymentMethod } from '@/types/networks'
import { ArrowRightCircle, Box, CheckCircle2, Zap } from 'lucide-react'
import React from 'react'

interface ActivePaymentMethodButtonProps {
    active?: boolean,
    handler: () => void,
    method?: PaymentMethod,
    balance?: string | number,
    disabled?: boolean
}

const ActivePaymentMethodButton = ({ active=false, handler, method='wallet', balance='0.00', disabled }: ActivePaymentMethodButtonProps) => {
  return (
        <button className={cn('flex items-center justify-between py-3 px-2.5 rounded-lg focus:outline-none focus:border-none border-none bg-violet-100', {
            'bg-green-200 text-green-900 dark:bg-green-400/60 dark:text-green-50': active,
            'opacity-80 bg-red-50 text-red-800 dark:bg-red-400/60 dark:text-red-50': disabled
        })}
            onClick={handler}
            disabled={disabled}
        >
            <div className='flex flex-row gap-x-2 items-center text-xs md:text-sm'>
                <div className='flex flex-col'>
                    {
                        method === 'wallet' ? (
                            <Zap className='' size={24} />
                        ) : (
                            <Box className='' size={24} />
                        )
                    }
                </div>
                <div className='flex flex-col gap-y-0.5 items-start justify-start'>
                    <p className='font-semibold'>{
                            method === 'wallet' ? 'From Wallet' : 'From Cashback'
                        }</p>
                    <p className='text-base text-muted-foreground dark:text-white'>{balance}</p>
                    {disabled && <p className='md:text-xs text-muted-foreground dark:text-white text-[8px]'>Insufficient Funds, Please fund Your wallet.</p>}
                </div>
            </div>

            {!active ? <ArrowRightCircle className='text-violet-500 dark:text-white' size={20} /> : <CheckCircle2 className='text-green-600 dark:text-white' size={20} />}
        </button>
  )
}

export default ActivePaymentMethodButton
