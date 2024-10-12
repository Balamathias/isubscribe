'use client'

import { priceToInteger } from '@/funcs/priceToNumber'
import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { PaymentMethod } from '@/types/networks'
import { ArrowRight, ArrowRightCircle, Box, Check, CheckCircle2, Zap } from 'lucide-react'
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
        <button className={cn('flex items-center justify-between py-3 px-2.5 rounded-lg focus:outline-none focus:border-none border-none bg-violet-100 dark:bg-secondary relative', {
            'bg-green-200 text-green-900 dark:text-green-400': active,
            'opacity-80 bg-red-50 text-red-800 dark:text-red-400': disabled
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
                            method === 'wallet' ? 'From Wallet' : 'From Data Bonus'
                        }</p>

                    <p className='text-base text-muted-foreground'>{method === 'wallet' ? balance : formatDataAmount((priceToInteger(balance as string) * DATA_MB_PER_NAIRA))}</p>

                    {disabled && <p className='md:text-xs text-muted-foreground dark:text-white text-[8px]'>Insufficient Funds, Please fund Your wallet.</p>}
                </div>
            </div>

            {!active ? <ArrowRight className='text-violet-500 dark:text-violet-400' size={20} /> : <Check className='text-green-600 dark:text-green-400' size={20} />}
        </button>
  )
}

export default ActivePaymentMethodButton
