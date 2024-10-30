import { Tables } from '@/types/database'
import { CaretRightIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Button } from '../ui/button'
import ClaimBonusModal from './claim-bonus-modal'
import AddmoneyModal from './add-money-modal'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import PleaseSignIn from './please-sign-in.modal'

const FundClaimCrumb = async ({ wallet }: { wallet: Tables<'wallet'> | null }) => {
  const { data: { user } } = await getCurrentUser()
  return (
    <div className='flex flex-row-reverse justify-between items-center w-full'>
      {
        user ? (
          <ClaimBonusModal 
            wallet={wallet!}
            trigger={
              <Button variant={'ghost'} className='text-xs tracking-tight text-violet-50 p-0 rounded-full hover:opacity-70 hover:bg-inherit flex items-center space-x-0.5 md:space-x-1 hover:text-white'>
                  <span className='text-xs md:text-sm tracking-tighter animate-pulse'>Use bonus</span>
                  <CaretRightIcon className='h-7 w-7' />
              </Button>
            }
          />
        ): (
          <PleaseSignIn 
            trigger={
              <Button variant={'ghost'} className='text-xs tracking-tight text-violet-50 p-0 rounded-full hover:opacity-70 hover:bg-inherit flex items-center space-x-0.5 md:space-x-1 hover:text-white'>
                  <span className='text-xs md:text-sm tracking-tighter animate-pulse'>Use bonus</span>
                  <CaretRightIcon className='h-7 w-7' />
              </Button>
            }
          />
        )
      }

      <AddmoneyModal />
    </div>
  )
}

export default FundClaimCrumb