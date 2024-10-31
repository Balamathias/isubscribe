import React from 'react'
import SelectEducationProvider from './SelectEducationProvider'
import EducationCard from './education-cards'
import InputFields from './input-fields'
import { getUser } from '@/lib/supabase/accounts'

const EducationContent = async () => {
  const { data: profile } = await getUser()
  return (
    <div className=' flex flex-col gap-y-4 md:gap-y-4 max-sm:w-[90vw] w-[600px] rounded-xl'>
        <SelectEducationProvider />
        <InputFields />
        <EducationCard profile={profile!} />
    </div>
  )
}

export default EducationContent