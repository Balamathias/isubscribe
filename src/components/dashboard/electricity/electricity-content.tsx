import React from 'react'
import SelectElectricityProvider from '../SelectElectricityProvider'
import ElectricityCards from './electricity-cards'
import { getUser } from '@/lib/supabase/accounts'

const ElectricityContent = async () => {
  const { data: profile } = await getUser()
  return (
    <div className=' flex flex-col gap-y-2 md:gap-y-2 max-sm:w-[90vw] w-[600px] rounded-xl'>
        <SelectElectricityProvider />
        <ElectricityCards profile={profile!} />
    </div>
  )
}

export default ElectricityContent