import React, { useState } from 'react';

import DynamicModal from '@/components/DynamicModal';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTvCable } from '@/providers/tv-cable/tv-cable-provider';
import { toast } from 'sonner';

import { useGetProfile } from '@/lib/react-query/funcs/user';
import { ChevronDown } from 'lucide-react';
import PleaseSignIn from '../please-sign-in.modal';

const TvSelector = ({object, selected, setSelected}:any) => {
  const [open, setOpen] = useState(false);

  const { currentProvider, smartcardNumber, mobileNumber, setOpenConfirmPurchaseModal } = useTvCable()
  const { data: profile, isPending: profilePending } = useGetProfile()


  const handleOpenModal = () => {
    if (!smartcardNumber) return toast.warning('Please enter your decoder number, it can\'t be empty!')
        if ((smartcardNumber.length < 10) || (smartcardNumber.length > 10)) return toast.warning('Please enter a valid 10-digit decorder number')
        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit phone number')

        setOpen(true)
  }


  const handleCardClick = (item:any) => {
    setSelected(item);
    setTimeout(() => {
        setOpen(false);
    }, 500);
    
    setTimeout(() => {
        setOpenConfirmPurchaseModal?.(true)
    }, 500);
  };

  return (
    <>
      <div 
        onClick={handleOpenModal}
        className='bg-gray-200 hover:bg-gray-300 dark:bg-card/60 text-foreground hover:opacity-85 hover:transition-all p- rounded-lg cursor-pointer p-5'
      >
        {
          profile?.data ? (
            <div className='flex flex-row justify-between items-center border-none shadow-none outline-none'>
              <div className="flex flex-row space-x-3 items-center">
              
                <span className="text-lg text-muted-foreground">Select plan to proceed</span>
              </div>
              <ChevronDown className='w-6 h-6 text-muted-foreground' />
            </div>
          ): (
            <PleaseSignIn 
              message='Please sign in to continue'
              trigger={
                <div className='flex flex-row justify-between items-center border-none shadow-none outline-none'>
                  <div className="flex flex-row space-x-3 items-center">
                  
                    <span className="text-lg text-muted-foreground">Select plan to proceed</span>
                  </div>
                  <ChevronDown className='w-6 h-6 text-muted-foreground' />
                </div>
              }
            />
          )
        }
      </div>

      {
        open && 
        <DynamicModal
          open={open}
          setOpen={setOpen}
          dismissible
          dialogClassName={'sm:max-w-[640px] md:max-w-[550px] dark:bg-card'}
          drawerClassName='dark:bg-card'
        >
          <div className='h-[450px] space-y-1 overflow-y-auto'>
            {object[currentProvider]?.map((d:any, idx:any) => (
              <Card 
                key={idx + 1} 
                onClick={() => handleCardClick(d)}
                className='flex flex-row justify-between hover:border-b hover:border-b-violet-500 items-center cursor-pointer hover:opacity-90 space-y-3 dark:bg-card/60 border-b border-none rounded-none shadow-sm p-2 rounded-m outline-none hover:bg-secondary hover:transition-all hover:duration-300'
              >
                <div className="flex flex-row space-x-3 items-center">
                  <span className=" text-gray-900 dark:text-gray-400">{d?.name }</span>
                </div>
                <Switch 
                  defaultChecked={selected?.variation_code === d?.variation_code}
                  checked={selected?.variation_code === d?.variation_code}
                  onCheckedChange={() => handleCardClick(d)}
                />
              </Card>
            ))}
          </div>

        </DynamicModal>
      }
    </>
  );
};

export default TvSelector;
