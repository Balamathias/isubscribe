"use client"

import React, { useState, useEffect } from 'react';
import { LucideDelete, LucideX, BadgeCheckIcon, LucideLock } from 'lucide-react';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';

import { hashPin } from '@/funcs/bcrypt';
import LoadingOverlay from '../loaders/LoadingOverlay';
import { useGetProfile, useSetPassPin } from '@/lib/react-query/funcs/user';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { cn, dynamic } from '@/lib/utils';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/react-query/query-keys';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useVibration from '@/hooks/use-vibration';

const PassPinForm = ({onClose, className, update=false}: { onClose?: () => void, className?: string, update?: boolean }) => {

    const { data: profile, isPending: gettingProfile } = useGetProfile()
    const vibrate = useVibration()

    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');

    const { mutateAsync: setPassPin, isPending } = useSetPassPin()
    const router = useRouter()

    const queryClient = useQueryClient()
    
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
            update ? router.refresh() : router.replace("/dashboard")
            toast.success(`Transaction pin ${update ? 'reset' : 'set' } successfully.`)
            queryClient.invalidateQueries({ queryKey: [QueryKeys.get_user] })
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
          vibrate('failure')
          setPin('');
          setConfirmPin('');
          setIsConfirming(false);
        }
      }
    }, [confirmPin, pin]);
    
    return (
      <>
        <LoadingOverlay isPending={isPending || gettingProfile} />
        <Card className={cn("bg-white dark:bg-card border-none p-6 max-sm:w-[100vw] self-center md:min-w-[500px] rounded-3xl shadow-xl max-sm:bottom-0", className)}>
          <div className="md:text-2xl text-lg mb-6 text-center">
            <div className='flex flex-col gap-y-1 items-center justify-center'>
                {
                  dynamic(
                    <div className='h-12 w-12 rounded-full flex items-center justify-center bg-red-600/20 text-red-600'>
                        <LucideLock size={17} />
                    </div>,

                    <div className='flex flex-col gap-y-2.5 items-center justify-center text-center py-2'>
                      <Avatar className='w-16 h-16'>
                        <AvatarImage src={profile?.data?.avatar!} />
                        <AvatarFallback content={profile?.data?.full_name?.[0]} />
                      </Avatar>

                      <p className='text-muted-foreground text-sm'>
                        Hi <b className="font-semibold">{profile?.data?.full_name?.split(' ')?.at(0)}</b>, welcome to isubscribe. Set up your pin below to continue.
                      </p>
                    </div>,

                    update
                  )
                }
                {isPending ? (
                  <p>Checking...</p>
                ) : (<p className='text-primary dark:text-violet-400/90'>
                  {isConfirming ? 'Confirm PIN' : `${ update ? 'Reset' : 'Set' } your Transaction PIN`}
              </p>)}
            </div>
          </div>
          <div className="flex justify-center mb-6 space-x-4">
            {(isConfirming ? confirmPin : pin).split('').concat(['', '', '', '']).slice(0, 4).map((char, index) => (
               <div key={index} className="relative w-12 h-12">
               <input
                 type="password"
                 value={char}
                 readOnly
                 className="w-full h-full text-center text-3xl p-2 border-2 border-gray-300/90 dark:border-gray-500 rounded-xl focus:outline-none bg-secondary"
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
              <Button
                key={num}
                onClick={() => handleButtonClick(num.toString())}
                className="rounded-full"
                variant={'secondary'}
                size={'lg'}
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={handleClear}
              className="col-span-1 bg-rose-600/15 text-rose-700 rounded-full"
              variant={'secondary'}
              size={'lg'}
            >
              <LucideX className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleDelete}
              className="col-span-1 bg-red-600/15 text-red-700 rounded-full"
              variant={'secondary'}
              size={'lg'}
            >
              <LucideDelete className="w-6 h-6" />
            </Button>
          </div>
          {!update && <div className='flex items-center gap-x-1 !w-full flex-row justify-center'>
            <BadgeCheckIcon className='text-primary' size={20}></BadgeCheckIcon>
            <p className='text-muted-foreground text-xs'>Powered by:</p>
            <Logo 
                className={'!w-fit block !mx-0 !justify-start !items-center'}
                imageClassName='h-4 w-4'
                textClassName='text-xs'
            />
          </div>}
        </Card>
      </>
    );
}

export default PassPinForm