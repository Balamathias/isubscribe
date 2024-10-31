import React from 'react'
import SelectTvProvider from '../SelectTvProvider'
import { getUser } from '@/lib/supabase/accounts'


const TVContent = async () => {
  const { data: profile } = await getUser()

  return (
    <div className='flex-col gap-y-2 md:gap-y-2 max-sm:w-[90vw] w-[600px] '>
      <SelectTvProvider profile={profile!} />
    </div>
  )
}

export default TVContent