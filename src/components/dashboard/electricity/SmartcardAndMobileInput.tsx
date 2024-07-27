import React, { useState, useEffect } from 'react';
import { verifySmartcardNumber } from '@/lib/vtpass/services';
import { Loader2, Check, X, Tv, User, Calculator, Currency, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useElectricity } from '@/providers/electricity/electricity-provider';

const SmartcardAndMobileInput = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  const { currentProvider, mobileNumber, setMobileNumber, isPrepaid, setIsPrepaid, meterNumber, setMeterNumber  } = useElectricity();

  // console.log("type", isPrepaid ? "prepaid" : "postpaid")
  // console.log("cP", currentProvider)


  const payload = {
    serviceID: currentProvider,
    billersCode: meterNumber,
    type: isPrepaid ? "prepaid" : "postpaid"
  };

  const handleMeterNumberChange = (e:any) => {
    const value = e.target.value;
    if (/^\d{0,15}$/.test(value)) {
      setMeterNumber(value);
    }
  };

  const handleVerifyMeter = async () => {
    setLoading(true);
    setSuccess(false);
    setError(false);
    const res = await verifySmartcardNumber(payload);
    // console.log("Resssss", res)
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
    if (meterNumber?.length >= 13) {
      handleVerifyMeter();
    }
  }, [meterNumber]);

  return (
    <div className="space-y-4">
      <Card className="bg-whit p- flex flex-row gap-2 max-sm:justify-end justify-end items-center w-full border-none outline-none shadow-none">
        <div className='flex bg-white flex-row items-center p-3 gap-2 rounded-sm'>
          <span>Prepaid</span>
          <Switch checked={isPrepaid} onCheckedChange={() => setIsPrepaid(true)} />
        </div>
        <div className='flex flex-row items-center p-3 gap-2 rounded-sm bg-white'>
          <span>Postpaid</span>
          <Switch checked={!isPrepaid} onCheckedChange={() => setIsPrepaid(false)} />
        </div>
      </Card>

      <Card className="bg-white p-4 flex flex-col gap-3 justify-center w-full rounded-sm">
        <div className='flex flex-row gap-2 justify-center'>
          <span className="text-red-600 rounded-full bg-red-200 p-1 md:p-2">
            <Calculator />
          </span>
          <Input
            onChange={handleMeterNumberChange}
            value={meterNumber}
            type="tel"
            placeholder="Enter Meter Number here..."
          />
        </div>

        {loading && (
          <div className='flex flex-row gap-2 justify-center items-center'>
            <span className="text-violet-600 rounded-full bg-white p-1 md:p-2">
              <Loader2 className='animate-spin' />
            </span>
            <span className='h-8 w-full bg-gray-300 rounded-sm animate-pulse'></span>
          </div>
        )}

        {success && meterNumber?.length !== 0 && (
          <div className='flex flex-row gap-3 justify-center self-start items-center'>
            <span className="text-violet-600 rounded-full bg-green-100 p-1 md:p-1">
              <Check className='text-green-500' />
            </span>
            <span>{data?.Customer_Name}</span>
          </div>
        )}

        {error && meterNumber?.length !== 0 && (
          <div className='flex flex-row gap-3 self-start justify-center items-center'>
            <span className="text-violet-600 rounded-full bg-red-100 p-1 md:p-1">
              <X className='text-red-500' />
            </span>
            <span>{data?.error}</span>
          </div>
        )}
      </Card>

      <Card className="bg-white p-4 flex flex-row gap-2 justify-center w-full rounded-sm border-none outline-none shadow-none">
        <span className="text-white rounded-full bg-violet-500 p-1 md:p-2">
          <User />
        </span>
        <Input
          onChange={(e) => setMobileNumber(e.target.value)}
          type="tel"
          value={mobileNumber}
          placeholder="Enter Phone Number here..."
        />
      </Card>

     
    </div>
  );
};

export default SmartcardAndMobileInput;
