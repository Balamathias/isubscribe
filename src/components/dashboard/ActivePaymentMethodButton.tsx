'use client'

import { cn } from '@/lib/utils'
import { PaymentMethod } from '@/types/networks'
import { ArrowRightCircle, Box, CheckCircle2, Zap } from 'lucide-react'
import React from 'react'

interface ActivePaymentMethodButtonProps {
    active?: boolean,
    handler: () => void,
    method?: PaymentMethod,
    balance?: string | number
}

const ActivePaymentMethodButton = ({ active=false, handler, method='wallet', balance='0.00' }: ActivePaymentMethodButtonProps) => {
  return (
        <button className={cn('flex items-center justify-between py-3 px-2.5 rounded-lg focus:outline-none focus:border-none border-none bg-violet-100', {
            'bg-green-200 dark:bg-secondary text-green-900': active
        })}
            onClick={handler}
        >
            <div className='flex flex-row gap-x-2 items-center'>
                <div className='flex flex-col'>
                    {
                        method === 'wallet' ? (
                            <Zap className='text-violet-600' size={24} />
                        ) : (
                            <Box className='text-violet-600' size={24} />
                        )
                    }
                </div>
                <div className='flex flex-col gap-y-1.5 items-start justify-start'>
                    <p className='font-semibold'>{
                            method === 'wallet' ? 'From Wallet' : 'From Cashback'
                        }</p>
                    <p className='text-base text-muted-foreground'>{balance}</p>
                </div>
            </div>

            {!active ? <ArrowRightCircle className='text-violet-600' size={20} /> : <CheckCircle2 className='text-green-600' size={20} />}
        </button>
  )
}

export default ActivePaymentMethodButton
