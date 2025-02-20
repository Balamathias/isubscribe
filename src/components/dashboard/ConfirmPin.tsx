'use client'

import { unhashPin } from '@/funcs/bcrypt';
import { getUser } from '@/lib/supabase/accounts';
import { useNetwork } from '@/providers/data/sub-data-provider';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import LoadingOverlay from '../loaders/LoadingOverlay';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { LucideDelete, LucideLock, LucideX } from 'lucide-react';
import Link from 'next/link';
import { Tables } from '@/types/database';
import { useRouter, usePathname } from 'next/navigation';
import ConfirmSecurity from './settings/confirm-security';
import { Button } from '../ui/button';
import { getUserPin } from '@/lib/supabase/user.actions';
import useVibration from '@/hooks/use-vibration';

const ConfirmPin = ({ className, func: closeModal, setShowResetPin }: { className?: string, func?: () => void, profile?: Tables<'profile'> | null, setShowResetPin?: (bool: boolean) => void }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const router = useRouter()
    const path = usePathname()

    const vibrate = useVibration()

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

        const  { data: profile, error } = await getUserPin()

        if (error) return toast.error(error?.message)
      
        try {
          if (profile?.pin === null) return toast.warning("Pin Error", {
            description: "Please set your transaction Pin to continue",
            action: <Link href={'/dashboard/settings'} >Set My PIN</Link>,
            duration: 15000,
          })
          const pinPasses = await unhashPin(pin, profile?.pin!)

          setPinPasses?.(pinPasses)
          
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
              vibrate('failure')
            }
            setIsPending(false)
        } catch (error: any) {
          setIsPending(false)
          setError('Internal server error, please refresh and try again.')
          toast.error('Internal server error, please refresh and try again.')
          console.log(error)
          vibrate('failure')
        } finally { setIsPending(false) }
    };
    
    const handleButtonClick = (value: string) => {
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
          <div className="text-base mb-2.5 text-center flex items-center justify-center">
            <div className='flex flex-col gap-y-1 items-center justify-center'>
                <div className='h-12 w-12 rounded-full flex items-center justify-center bg-red-600/20 text-red-600'>
                    <LucideLock size={17} />
                </div>
                {isPending ? (
                  <p>Checking...</p>
                ) : (<p className='text-primary dark:text-violet-400'>Confirm Transaction Pin</p>)}
            </div>
          </div>
          <div className="flex justify-center mb-6 space-x-4">
            {(pin).split('').concat(['', '', '', '']).slice(0, 4).map((char, index) => (
               <div key={index} className="relative w-12 h-12">
               <input
                 type="password"
                 value={char}
                 readOnly
                 className="w-full h-full text-center text-3xl p-2 border-2 border-gray-300/90 dark:border-gray-500 dark:bg-card rounded-xl focus:outline-none"
                 style={{ color: 'transparent', textShadow: '0 0 0 violet' }}
               />
               {char && (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-3 h-3 bg-violet-500/80 rounded-full"></div>
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
                className="bg-violet-50 text-foreground dark:bg-secondary md:text-xl text-lg md:p-2.5 p-1.5 rounded-full hover:bg-violet-100 hover:bg-secondary hover:opacity-80 hover:transition-all focus:outline-none"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="col-span-1 bg-violet-100 text-foreground dark:bg-secondary dark:text-gray-200 text-lg md:p-2.5 p-1.5 hover:bg-violet-100 focus:outline-none flex justify-center items-center hover:bg-secondary hover:opacity-80 hover:transition-all rounded-full"
            >
              <LucideX className="w-6 h-6" />
            </button>
            <button
              onClick={handleDelete}
              className="col-span-1 bg-violet-50 dark:bg-secondary text-violet-700 text-lg md:p-2.5 p-1.5 hover:bg-violet-100 focus:outline-none flex justify-center items-center hover:bg-secondary hover:opacity-80 hover:transition-all rounded-full"
            >
              <LucideDelete className="w-6 h-6" />
            </button>
          </div>
          
          {
            path?.includes('/dashboard/settings') ? (
              <ConfirmSecurity 
                  trigger={
                    <Button asChild variant={'link'} className='flex items-center gap-x-1 !w-full flex-row'>
                      <Link href={'#'} className={'text-primary/80 dark:text-violet-400 underline text-sm'}>Forgot PIN?</Link>
                    </Button>
                  }
                  setShowResetPin={setShowResetPin}
                  func={closeModal}
                />
            ): (
              <Button asChild variant={'link'} className='flex items-center gap-x-1 !w-full flex-row'>
                <Link href={'/dashboard/settings'} className={'text-primary/80 dark:text-violet-400 underline text-sm'}>Forgot PIN?</Link>
              </Button>
            )
          }
        </Card>
      </div>
  )
}

export default ConfirmPin
