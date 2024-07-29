import React, { useState } from 'react';
import Image from 'next/image';

import { ChevronDown, LucideArrowDown } from 'lucide-react';
import DynamicModal from '@/components/DynamicModal';
import { electricServices } from '@/utils/constants/electricity-plans';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useElectricity } from '@/providers/electricity/electricity-provider';


const ElectricityProviderSelector = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(electricServices[0]);
  const {setCurrentProvider, currentProvider, setProviderName, setProviderImage} = useElectricity()

  // console.log("CCCCCCCCCPPPPPPPPPPP",currentProvider)


  const handleCardClick = (item:any) => {
    setSelected(item);
    setCurrentProvider(item?.serviceID)
    setProviderName(item?.fullName)
    setProviderImage(item?.image)
    setTimeout(() => {
      setOpen(false); // Close the modal
    }, 500);
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className='bg-gray-200 hover:bg-gray-300 dark:bg-card/60 text-foreground hover:opacity-85 hover:transition-all p-2 rounded-lg cursor-pointer py-3.5'
      >
        <div className='flex flex-row justify-between items-center space-y-3 border-none shadow-none outline-none'>
          <div className="flex flex-row space-x-3 items-center">
            <Image src={selected?.image} height={1000} width={1000} alt={selected?.name} className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xs text-muted-foreground">{selected?.fullName} Distribution Company</span>
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
            {electricServices.map(service => (
              <Card 
                key={service.serviceID} 
                onClick={() => handleCardClick(service)}
                className='flex flex-row justify-between hover:border-b hover:border-b-violet-500 items-center cursor-pointer hover:opacity-90 space-y-3 dark:bg-card/60 border-b border-none rounded-none shadow-sm p-2 rounded-m outline-none hover:bg-secondary hover:transition-all hover:duration-300'
              >
                <div className="flex flex-row space-x-3 items-center">
                  <Image src={service.image} height={1000} width={1000} alt={service.fullName} className="h-10 w-10 rounded-full object-cover" />
                  <span className="text-xs text-gray-900 dark:text-gray-400">{service.fullName}</span>
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
    </>
  );
};

export default ElectricityProviderSelector;
