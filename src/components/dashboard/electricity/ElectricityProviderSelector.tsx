'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { ChevronDown, Search } from 'lucide-react';
import DynamicModal from '@/components/DynamicModal';
import { electricServices } from '@/utils/constants/electricity-plans';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useElectricity } from '@/providers/electricity/electricity-provider';
import CustomInput from '@/components/CustomInput';

const ElectricityProviderSelector = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(electricServices[0]);
  const [filter, setFilter] = useState('');
  const { setCurrentProvider, setProviderName, setProviderImage } = useElectricity();

  const handleCardClick = (item: any) => {
    setSelected(item);
    setCurrentProvider(item?.serviceID);
    setProviderName(item?.fullName);
    setProviderImage(item?.image);
    setTimeout(() => {
      setOpen(false);
    }, 500);
  };

  const filteredServices = electricServices.filter(service =>
    service.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className='bg-card/60 text-foreground hover:opacity-85 hover:transition-all p-2.5 md:p-4 rounded-lg cursor-pointer py-3.5'
      >
        <div className='flex flex-row justify-between items-center border-none shadow-none outline-none'>
          <div className="flex flex-row space-x-3 items-center">
            <Image src={selected?.image} height={1000} width={1000} alt={selected?.name} className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xs text-muted-foreground">{selected?.fullName} Distribution Company</span>
          </div>
          <ChevronDown className='w-6 h-6 text-muted-foreground' />
        </div>
      </div>

      {open && (
        <DynamicModal
          open={open}
          setOpen={setOpen}
          dismissible
          dialogClassName={'sm:max-w-[640px] md:max-w-[550px]'}
          drawerClassName=''
          blurHeader
          title={
            <div className='flex items-center w-full h-auto px-2 bg-inherit/20 backdrop-blur-sm'>
              <CustomInput
                placeholder='Filter providers...'
                Icon={Search}
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
          }
        >
          <div className='h-[450px] space-y-1 overflow-y-auto no-scrollbar'>
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <Card
                  key={service.serviceID}
                  onClick={() => handleCardClick(service)}
                  className='flex flex-row justify-between hover:border-b hover:border-b-violet-500 items-center cursor-pointer hover:opacity-90 space-y-3 border-b !bg-inherit border-none rounded-none shadow-sm p-2 rounded-m outline-none hover:bg-secondary hover:transition-all hover:duration-300'
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
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No providers found for <span className="font-semibold">{filter}</span>.</div>
            )}
          </div>
        </DynamicModal>
      )}
    </>
  );
};

export default ElectricityProviderSelector;
