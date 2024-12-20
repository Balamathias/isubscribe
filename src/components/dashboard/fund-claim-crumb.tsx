import { Tables } from '@/types/database'
import { CaretRightIcon } from '@radix-ui/react-icons'
import React, { Suspense } from 'react'
import { Button } from '../ui/button'
import ClaimBonusModal from './claim-bonus-modal'
import AddmoneyModal from './add-money-modal'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import Link from 'next/link'

import { LucidePlus } from 'lucide-react'

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
          <Button asChild variant={'ghost'} className='text-xs tracking-tight text-violet-50 p-0 rounded-full hover:opacity-70 hover:bg-inherit flex items-center space-x-0.5 md:space-x-1 hover:text-white'>
            <Link href="/sign-in">
              <span className='text-xs md:text-sm tracking-tighter animate-pulse'>Sign in</span>
              <CaretRightIcon className='h-7 w-7' />
            </Link>
          </Button>
        )
      }

      <Suspense fallback={
        <Button disabled className='text-xs tracking-tighter text-violet-950 flex items-center space-x-1 bg-white md:p-2.5 py-1.5 px-3 rounded-full md:px-5 w-fit hover:bg-violet-100 hover:transition-all'>
            <LucidePlus size={18} />
            <span>Add Money</span>
        </Button>
      }>
        <AddmoneyModal />
      </Suspense>
    </div>
  )
}

export default FundClaimCrumb