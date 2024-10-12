import React from 'react'
import DynamicModal from '../DynamicModal'
import { GiftIcon, LucideArrowBigRight, LucideTriangle } from 'lucide-react'
import { Tables } from '@/types/database'
import { DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'

interface ClaimBonusModalProps {
    open?: boolean,
    setOpen?: (bool: boolean) => void,
    trigger?: React.ReactNode,
    wallet: Tables<'wallet'> 
}
const ClaimBonusModal = ({ open, setOpen, trigger, wallet }: ClaimBonusModalProps) => {
  return (
    <DynamicModal
            open={open}
            setOpen={setOpen}
            trigger={trigger}
        >
            <div className='flex flex-col py-2 gap-y-4 items-center justify-center text-center'>
                <div className='h-12 w-12 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
                    <GiftIcon size={16} />
                </div>

                <h2 className='text-lg font-semibold tracking-tighter text-center'>You have <b className='font-bold'>{formatDataAmount(wallet?.cashback_balance! * DATA_MB_PER_NAIRA)}</b> bonus data.</h2>

                <h2 className='text-base tracking-tighter text-center'>You can claim your bonus by completing the steps below.</h2>
                <div className='flex flex-col'>
                  <div className='flex flex-row justify-between gap-x-1.5'>
                    <Button variant={'ghost'} className='rounded-full'>
                      <LucideTriangle className='text-amber-500 mr-1' />
                      <span>Get a fixed plan</span>
                    </Button>

                    <Button variant={'ghost'} className='rounded-full' asChild>
                      <Link href={'/dashboard/data?action=claim'} className='flex items-center gap-x-1'>
                        <span>Select Plan</span>
                        <LucideArrowBigRight className='text-amber-500' />
                      </Link>
                    </Button>
                  </div>
                </div>
            </div>
    </DynamicModal>
  )
}

export default ClaimBonusModal