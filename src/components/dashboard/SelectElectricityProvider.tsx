import React from 'react';
import ElectricityProviderSelector from './electricity/ElectricityProviderSelector';
import SmartcardAndMobileInput from './electricity/SmartcardAndMobileInput';
import { getUser } from '@/lib/supabase/accounts';

const SelectElectricityProvider = async () => {
  const { data: profile } = await getUser()

  return (
    <div className="max-sm:w-[90vw] w-[600px] space-y-4 rounded-xl">
      <ElectricityProviderSelector />
      <SmartcardAndMobileInput profile={profile!} />
    </div>
  );
};

export default SelectElectricityProvider;
