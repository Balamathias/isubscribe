"use client"

import React from 'react'

import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover"
import { useBeneficiaries } from '@/lib/react-query/funcs/beneficiaries';
import { Button } from '../ui/button';
import { useNetwork } from '@/providers/data/sub-data-provider';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void;
}


const Beneficiaries = ({ open, setOpen }: Props) => {

  const { data: beneficiaries } = useBeneficiaries()
  const { setMobileNumber } = useNetwork()

  if (!beneficiaries?.length) return null
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-y-2">
          <h2>Popover</h2>
          {
            beneficiaries?.map(phone => (
                <Button 
                    key={phone} 
                    variant={'ghost'} 
                    className="w-full rounded-full"
                    onClick={() => setMobileNumber(phone)}
                >
                    {phone}
                </Button>
            ))
          }
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Beneficiaries