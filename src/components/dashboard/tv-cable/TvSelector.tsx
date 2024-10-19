import React, { useState } from 'react';
import Image from 'next/image';

import { ChevronDown, LucideArrowDown } from 'lucide-react';
import DynamicModal from '@/components/DynamicModal';
import { electricServices } from '@/utils/constants/electricity-plans';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useElectricity } from '@/providers/electricity/electricity-provider';
import { useTvCable } from '@/providers/tv-cable/tv-cable-provider';
import { toast } from 'sonner';


const TvSelector = ({object, selected, setSelected}:any) => {
  const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState(electricServices[0]);
//   const {setCurrentProvider, currentProvider, setProviderName, setProviderImage} = useElectricity()

  const { currentProvider, smartcardNumber, mobileNumber, setMobileNumber, openConfirmPurchaseModal, setOpenConfirmPurchaseModal, handleBuyTvCable} = useTvCable()

  // console.log("CCCCCCCCCPPPPPPPPPPP",currentProvider)


  const handleOpenModal = () => {
    if (!smartcardNumber) return toast.warning('Please enter your decoder number, it can\'t be empty!')
        if ((smartcardNumber.length < 10) || (smartcardNumber.length > 10)) return toast.warning('Please enter a valid 10-digit decorder number')
        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit phone number')
        // if ((mobileNumber.length < 12) || (mobileNumber.length > 12)) return setOpenMobileNumber(true)

        setOpen(true)
  }


  const handleCardClick = (item:any) => {
    setSelected(item);
    setTimeout(() => {
        setOpen(false); // Close the modal
    }, 500);
    
    setTimeout(() => {
        setOpenConfirmPurchaseModal?.(true)
    }, 500);
  };

//   console.log("SEEEEEEEEEEEELLLL", selected)

  return (
    <>
      <div 
        onClick={handleOpenModal}
        className='bg-gray-200 hover:bg-gray-300 dark:bg-card/60 text-foreground hover:opacity-85 hover:transition-all p- rounded-lg cursor-pointer p-5'
      >
        <div className='flex flex-row justify-between items-center border-none shadow-none outline-none'>
          <div className="flex flex-row space-x-3 items-center">
          
            <span className="text-lg text-muted-foreground">Select plan to proceed</span>
          </div>
          <ChevronDown className='w-6 h-6 text-muted-foreground' />
        </div>
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
