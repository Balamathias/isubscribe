'use client'

import { unhashPin } from '@/funcs/bcrypt';
import { getUser } from '@/lib/supabase/accounts';
import { useNetwork } from '@/providers/data/sub-data-provider';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import LoadingOverlay from '../loaders/LoadingOverlay';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { LucideDelete, LucideX } from 'lucide-react';
import Link from 'next/link';
import { useGetProfile } from '@/lib/react-query/funcs/user';

const ConfirmPin = ({ className, func: closeModal }: { className?: string, func?: () => void }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { data: profile, isPending: _isPending } = useGetProfile()

    const { setPinPasses } = useNetwork()
    const [isPending, setIsPending] = useState(false)
    
    
    const handleClear = () => {
        setPin('');
    };
    
    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };
    
    const handleCheckPin = async () => {
      
      setIsPending(true)
      
        const pinPasses = await unhashPin(pin, profile?.data?.pin!)

        setPinPasses?.(pinPasses)
        
        setIsPending(false)
        if (pinPasses) {
            setError('')
            setPin('')
            toast.success('Pin Verified Successfully')
            closeModal?.()
        }
        else {
            setError('Invalid pin, Please Try Again.')
            toast.error('Invalid pin, please try again.')
            setPin('')
        }
    };
    
    const handleButtonClick = async (value: string) => {
        if (pin.length < 4) {
            setPin(pin + value);
            setError("")
          }
    }

    useEffect(() => {
        if (pin.length === 4) {
            handleCheckPin()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin])

  return (
    <div className="flex flex-col items-center justify-center">
        <LoadingOverlay isPending={isPending} />
        <Card className={cn("bg-white dark:bg-card border-none p-6 max-sm:w-full self-center md:min-w-[500px] rounded-3xl shadow-none drop-shadow-none", className)}>
          <div className="md:text-xl text-base mb-6 text-center">
            {isPending ? (
              <p>Checking...</p>
            ) : (
            <p className='text-primary dark:text-primary/90'>
                Enter Your Transaction PIN
            </p>
            )}
          </div>
          <div className="flex justify-center mb-6 space-x-4">
            {(pin).split('').concat(['', '', '', '']).slice(0, 4).map((char, index) => (
               <div key={index} className="relative w-12 h-12">
               <input
                 type="password"
                 value={char}
                 readOnly
                 className="w-full h-full text-center text-3xl p-2 border-2 border-gray-300/90 dark:border-gray-500 rounded-xl focus:outline-none"
                 style={{ color: 'transparent', textShadow: '0 0 0 violet' }}
               />
               {char && (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                 </div>
               )}
             </div>
            ))}
          </div>
          {error && <div className="text-red-500 text-center mb-4 text-xs md:text-sm">{error}</div>}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => handleButtonClick(num.toString())}
                className="bg-violet-50 text-gray-700 md:text-xl text-lg md:p-4 p-2.5 rounded-xl hover:bg-violet-100 focus:outline-none"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="col-span-1 bg-violet-100 text-gray-700 dark:text-gray-200 md:text-xl text-lg md:p-4 p-2.5 rounded-xl hover:bg-violet-100 focus:outline-none flex justify-center items-center"
            >
              <LucideX className="w-6 h-6" />
            </button>
            <button
              onClick={handleDelete}
              className="col-span-1 bg-violet-50 text-violet-700 md:text-xl text-lg md:p-4 p-2.5 rounded-xl hover:bg-violet-100 focus:outline-none flex justify-center items-center"
            >
              <LucideDelete className="w-6 h-6" />
            </button>
          </div>
          <div className='flex items-center gap-x-1 !w-full flex-row'>
            <Link href={'#'} className={'text-primary underline text-sm'}>Forgot PIN?</Link>
          </div>
        </Card>
      </div>
  )
}

export default ConfirmPin
