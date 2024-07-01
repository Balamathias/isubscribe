"use client"

import React, { useState, useEffect } from 'react';
import { LucideDelete, LucideX, LucideCheckCircle, BadgeCheckIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';

import { hashPin } from '@/funcs/bcrypt';
import LoadingOverlay from '../loaders/LoadingOverlay';
import { useSetPassPin } from '@/lib/react-query/funcs/user';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PassPinForm = ({onClose, className}: { onClose?: () => void, className?: string }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');

    const { mutateAsync: setPassPin, isPending } = useSetPassPin()
    const router = useRouter()
    
    const handleButtonClick = (value: string) => {
      if (isConfirming) {
        if (confirmPin.length < 4) {
          setConfirmPin(confirmPin + value);
          setError("")
        }
      } else {
        if (pin.length < 4) {
          setPin(pin + value);
          setError("")
        }
      }
    };
    
    const handleClear = () => {
      if (isConfirming) {
        setConfirmPin('');
      } else {
        setPin('');
      }
    };
    
    const handleDelete = () => {
      if (isConfirming) {
        setConfirmPin(confirmPin.slice(0, -1));
      } else {
        setPin(pin.slice(0, -1));
      }
    };
    
    const handleSubmit = async () => {

      setPassPin({pin: (await hashPin(pin))}, {
        onSuccess: () => {
            router.replace("/dashboard")
            toast.success('Transaction pin set successfully.')
            onClose?.()
        },
      })
    };
    
    useEffect(() => {
      if (pin.length === 4 && !isConfirming) {
        setIsConfirming(true);
      }
    }, [pin, isConfirming]);
    
    useEffect(() => {
      if (confirmPin.length === 4) {
        if (pin === confirmPin) {
          handleSubmit();
        } else {
          setError('PINs do not match. Try again.');
          setPin('');
          setConfirmPin('');
          setIsConfirming(false);
        }
      }
      // eslint-ignore
    }, [confirmPin, pin]);
    
    return (
      <>
        <LoadingOverlay isPending={isPending} />
        <Card className={cn("bg-white dark:bg-card border-none p-6 max-sm:w-[100vw] self-center md:min-w-[500px] rounded-3xl shadow-xl", className)}>
          <div className="text-2xl mb-6 text-center">
            {isPending ? (
              <p>Confirming...</p>
            ) : (
            <p className='text-primary dark:text-primary/90'>
                {isConfirming ? 'Confirm PIN' : 'Set your Transaction PIN'}
            </p>
            )}
          </div>
          <div className="flex justify-center mb-6 space-x-4">
            {(isConfirming ? confirmPin : pin).split('').concat(['', '', '', '']).slice(0, 4).map((char, index) => (
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
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => handleButtonClick(num.toString())}
                className="bg-violet-50 text-gray-700 text-2xl max-md:p-5 p-3 rounded-xl hover:bg-violet-100 focus:outline-none"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="col-span-1 bg-violet-100 text-gray-700 dark:text-gray-200 text-2xl p-5 rounded-xl hover:bg-violet-100 focus:outline-none flex justify-center items-center"
            >
              <LucideX className="w-6 h-6" />
            </button>
            <button
              onClick={handleDelete}
              className="col-span-1 bg-violet-50 text-violet-700 text-2xl p-5 rounded-xl hover:bg-violet-100 focus:outline-none flex justify-center items-center"
            >
              <LucideDelete className="w-6 h-6" />
            </button>
          </div>
          <div className='flex items-center gap-x-1 !w-full flex-row'>
            <BadgeCheckIcon className='text-primary' size={20}></BadgeCheckIcon>
            <p className='text-muted-foreground text-xs'>Powered by:</p>
            <Logo 
                className={'!w-fit block !mx-0 !justify-start !items-center'}
                imageClassName='h-8 w-8'
                textClassName='text-xs'
            />
          </div>
        </Card>
      </>
    );
}

export default PassPinForm