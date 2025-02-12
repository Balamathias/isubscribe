"use client"

import React, { useState, useEffect } from 'react';
import { verifySmartcardNumber } from '@/lib/vtpass/services';
import { Loader2, Check, X, Tv, User, Calculator, Currency, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import CustomInput from '../CustomInput';
import { useEducation } from '@/providers/education/education-provider';

const InputFields = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);

  const { currentProvider, mobileNumber, setMobileNumber, isUTME, setIsUTME, profileCode, setProfileCode  } = useEducation();

  // console.log("type", isUTME ? "prepaid" : "postpaid")
  // console.log("cP", currentProvider)


  const payload = {
    serviceID: currentProvider,
    billersCode: profileCode,
    type: isUTME ? "utme" : "de"
  };

  const handleprofileCodeChange = (e:any) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setProfileCode(value);
    }
  };

  const handleVerifyProfileCode = async () => {
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
    if (profileCode?.length === 10) {
      handleVerifyProfileCode();
    }
  }, [profileCode]);

  return (
      <div className="space-y-4">
      { 
       currentProvider === "jamb" &&
       (
        <>
        <Card className="dark:bg-card/60 flex flex-row gap-2 max-sm:justify-end justify-end items-center w-full border-none outline-none shadow-none rounded-lg">
            <div className='flex flex-row items-center p-3 gap-2 rounded'>
            <span>UTME</span>
            <Switch checked={isUTME} onCheckedChange={() => setIsUTME?.(true)} />
            </div>
            <div className='flex flex-row items-center p-3 gap-2 rounded-lg'>
            <span>DE</span>
            <Switch checked={!isUTME} onCheckedChange={() => setIsUTME?.(false)} />
            </div>
        </Card>

            <Card className="p-4 px-1.5 flex flex-col gap-y-3 justify-center w-full rounded-lg shadow-none border-none drop-shadow-none">
                <div className='flex flex-row gap-x-2 items-center justify-between w-full'>
                <p className="text-red-600 bg-red-200 h-10 w-10 aspect-square rounded-full flex items-center justify-center">
                    <Calculator size={16}/>
                </p>
                <CustomInput
                    onChange={handleprofileCodeChange}
                    value={profileCode}
                    type="tel"
                    placeholder="Enter your Profile Code here..."
                    className='w-[92%]'
                    />
                </div>

                {loading && (
                    <div className='flex flex-row gap-2 justify-center items-center'>
                    <p className="text-violet-600 rounded-full bg-white p-1 md:p-2">
                    <Loader2 className='animate-spin' />
                    </p>
                    <span className='h-8 w-full bg-gray-300 rounded-sm animate-pulse'></span>
                </div>
                )}

                {success && profileCode?.length !== 0 && (
                    <div className='flex flex-row gap-3 justify-center self-start items-center'>
                    <p className="text-violet-600 bg-green-100 h-10 w-10 rounded-full flex items-center justify-center">
                    <Check className='text-green-500' size={16} />
                    </p>
                    <span className='text-sm tracking-tighter'>{data?.Customer_Name}</span>
                </div>
                )}

                {error && profileCode?.length !== 0 && (
                    <div className='flex flex-row gap-3 self-start justify-center items-center'>
                    <p className="text-violet-600 bg-red-100 h-10 w-10 rounded-full flex items-center justify-center">
                    <X className='text-red-500' size={16} />
                    </p>
                    <span className='text-sm tracking-tighter'>{data?.error}</span>
                </div>
                )}
            </Card>
        </>
      )
    }

      <Card className="bg-white p-4 px-1.5 flex flex-row gap-2 justify-center w-full rounded-sm border-none outline-none shadow-none">
        <p className="text-white bg-violet-500 h-10 w-10 rounded-full flex items-center justify-center aspect-square">
          <User size={16}/>
        </p>
        <CustomInput
          onChange={(e) => setMobileNumber(e.target.value)}
          type="tel"
          value={mobileNumber}
          placeholder="Enter Phone Number here..."
          className='w-[92%]'
        />
      </Card>

     
    </div>
  );
};

export default InputFields;
