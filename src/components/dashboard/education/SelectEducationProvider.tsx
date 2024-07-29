"use client"

import React, { useState } from 'react';
import Image from 'next/image';

import { ChevronDown, LucideArrowDown } from 'lucide-react';
import DynamicModal from '@/components/DynamicModal';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useEducation } from '@/providers/education/education-provider';
import { educationServices } from '@/utils/constants/education-plans';


const SelectEducationProvider = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(educationServices[0]);
  const {setCurrentProvider, currentProvider, setProviderName, setProviderImage, setEducationAmount} = useEducation()

  // console.log("CCCCCCCCCPPPPPPPPPPP",currentProvider)


  const handleCardClick = (item:any) => {
    setSelected(item);
    setCurrentProvider(item?.serviceID)
    setProviderName(item?.ServiceName)
    setProviderImage(item?.image)
    setEducationAmount(item?.amount)
    setTimeout(() => {
      setOpen(false); // Close the modal
    }, 500);
  };

  return (
    <div className="max-sm:w-[90vw] w-[600px] space-y-4 rounded-xl">
      <div 
        onClick={() => setOpen(true)}
        className='bg-gray-200 hover:bg-gray-300 dark:bg-card/60 text-foreground hover:opacity-85 hover:transition-all p-2 rounded-lg cursor-pointer py-3.5'
      >
        <div className='flex flex-row justify-between items-center border-none shadow-none outline-none'>
          <div className="flex flex-row space-x-3 items-center">
            <Image src={selected?.image} height={1000} width={1000} alt={selected?.name} className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xs text-muted-foreground">{selected?.ServiceName}</span>
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
          <div className=' min-h-[300px] space-y-1 overflow-y-auto'>
            {educationServices.map(service => (
              <Card 
                key={service.serviceID} 
                onClick={() => handleCardClick(service)}
                className='flex flex-row justify-between hover:border-b hover:border-b-violet-500 items-center cursor-pointer hover:opacity-90 space-y-3 dark:bg-card/60 border-b border-none rounded-none shadow-sm p-2 rounded-m outline-none hover:bg-secondary hover:transition-all hover:duration-300'
              >
                <div className="flex flex-row space-x-3 items-center">
                  <Image src={service.image} height={1000} width={1000} alt={service?.ServiceName} className="h-10 w-10 rounded-full object-cover" />
                  <span className="text-xs text-gray-900 dark:text-gray-400">{service?.ServiceName}</span>
                </div>
                <Switch 
                  defaultChecked={selected?.serviceID === service.serviceID}
                  checked={selected?.serviceID === service.serviceID}
                  onCheckedChange={() => handleCardClick(service)}
                />
              </Card>
            ))}
          </div>
        </DynamicModal>
      }

    </div>
  );
};

export default SelectEducationProvider;
