import { Tables } from '@/types/database'
import { CaretRightIcon } from '@radix-ui/react-icons'
import { LucidePlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import ClaimBonusModal from './claim-bonus-modal'

const FundClaimCrumb = ({ wallet }: { wallet: Tables<'wallet'> | null }) => {
  return (
    <div className='flex flex-row-reverse justify-between items-center w-full'>
      <ClaimBonusModal 
        wallet={wallet!}
        trigger={
          <Button variant={'ghost'} className='text-xs tracking-tight text-violet-50 p-0 rounded-full hover:opacity-70 hover:bg-inherit flex items-center space-x-0.5 md:space-x-1 hover:text-white'>
              <span className='text-xs md:text-sm tracking-tighter animate-pulse'>Use bonus</span>
              <CaretRightIcon className='h-7 w-7' />
          </Button>
        }
      />

        <Link href={'/dashboard/fund-wallet'} className='text-xs tracking-tighter text-violet-950 flex items-center space-x-1 bg-white md:p-2.5 py-1.5 px-3  rounded-full md:px-5 w-fit hover:bg-violet-100 hover:transition-all'>
            <LucidePlus size={18} />
            <span>Add Money</span>
        </Link>
    </div>
  )
}

export default FundClaimCrumb