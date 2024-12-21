'use client'

import React, { useState, useEffect } from 'react';
import { verifySmartcardNumber } from '@/lib/vtpass/services';
import { Loader2, Check, X, Tv, User, Calculator, Currency, Coins, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useElectricity } from '@/providers/electricity/electricity-provider';
import CustomInput from '../CustomInput';
import { Tables } from '@/types/database';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const SmartcardAndMobileInput = ({ profile }: { profile?: Tables<'profile'> | null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);

  const { currentProvider, mobileNumber, setMobileNumber, isPrepaid, setIsPrepaid, meterNumber, setMeterNumber  } = useElectricity();

  const payload = {
    serviceID: currentProvider,
    billersCode: meterNumber,
    type: isPrepaid ? "prepaid" : "postpaid"
  };

  const handleMeterNumberChange = (e:any) => {
    const value = e.target.value;
    if (/^\d{0,13}$/.test(value)) {
      setMeterNumber(value);
    }
  };

  const handleVerifyMeter = async () => {

    if (!profile) return
    
    setLoading(true);
    setSuccess(false);
    setError(false);
    const res = await verifySmartcardNumber(payload);
    setData(res?.content);
    if (res?.content?.Customer_Name) {
      setSuccess(true);
      setError(false);
      setLoading(false);
    }
    if (res?.content?.error) {
      setError(true);
      setSuccess(false);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (meterNumber?.length === 13) {
      handleVerifyMeter();
    }
  }, [meterNumber]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-y-5">

        <div className="flex flex-col gap-y-4">
          <Card className={cn('h-20 items-center justify-between py-3 px-2.5 cursor-pointer hover:opacity-75 hover:transition-all dark:bg-card/60 flex rounded-lg border-none', isPrepaid && '!border border-primary')} role="button" onClick={() => setIsPrepaid?.(true)}>
            <span>Prepaid</span>
            <Switch checked={isPrepaid} onCheckedChange={() => setIsPrepaid?.(true)} />
          </Card>

          <Card className={cn('h-20 items-center justify-between py-3 px-2.5 cursor-pointer hover:opacity-75 hover:transition-all dark:bg-card/60 flex rounded-lg border-none', !isPrepaid && '!border border-primary')} role='button' onClick={() => setIsPrepaid?.(false)}>
            <span>Postpaid</span>
            <Switch checked={!isPrepaid} onCheckedChange={() => setIsPrepaid?.(false)} />
          </Card>
        </div>
      </div>

      <Card className="p-4 px-2.5 flex flex-col gap-y-3 justify-center w-full rounded-lg shadow-none border-none drop-shadow-none">
        <div className='flex flex-col gap-y-4 w-full'>
          <Label className="flex flex-row items-center gap-x-1.5" htmlFor='meter'>
            <Calculator size={20}/>
            <span>Meter Number:</span>
          </Label>
          <CustomInput
            onChange={handleMeterNumberChange}
            value={meterNumber}
            type="tel"
            placeholder="Enter Meter Number here."
            className='w-full bg-background border'
            id='meter'
            name='meter'
          />
        </div>

        {loading && (
          <p className='flex items-center gap-x-1.5'>
            <Loader2 className='animate-spin' /> <span className='text-muted-foreground animate-pulse'>Verifying...</span>
          </p>
        )}

        {success && meterNumber?.length !== 0 && (
          <div className='flex flex-row gap-3 justify-center self-start items-center'>
            <span className="bg-green-600/15 text-green-600 h-10 w-10 rounded-full flex items-center justify-center">
              <Check size={16} />
            </span>
            <span className='text-sm tracking-tighter text-muted-foreground'>{data?.Customer_Name}</span>
          </div>
        )}

        {error && meterNumber?.length !== 0 && (
          <div className='flex flex-row gap-3 self-start justify-center items-center'>
            <span className="bg-amber-600/15 text-amber-600 h-10 w-10 rounded-full flex items-center justify-center">
              <X size={16} />
            </span>
            <span className='text-sm tracking-tighter text-muted-foreground'>{data?.error}</span>
          </div>
        )}
      </Card>

      <Card className="p-4 px-2.5 flex flex-col gap-y-3 justify-center w-full rounded-lg shadow-none border-none drop-shadow-none">
        <div className='flex flex-col gap-y-4 w-full'>
          <Label className="flex flex-row items-center gap-x-1.5" htmlFor='phone'>
            <Phone size={20}/>
            <span>Phone Number:</span>
          </Label>
          <CustomInput
            onChange={(e) => setMobileNumber(e.target.value)}
            type="tel"
            value={mobileNumber}
            placeholder="Enter Phone Number here."
            className='w-full bg-background border'
            id='phone'
            name='phone'
            min={11}
            max={11}
          />
        </div>
      </Card>

     
    </div>
  );
};

export default SmartcardAndMobileInput;
