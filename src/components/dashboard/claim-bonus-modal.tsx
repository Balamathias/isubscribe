'use client'

import React from 'react'
import { motion } from 'framer-motion'
import DynamicModal from '../DynamicModal'
import { GiftIcon, LucideArrowBigRight, LucideX } from 'lucide-react'
import { Tables } from '@/types/database'
import { DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DialogClose } from '../ui/dialog'

interface ClaimBonusModalProps {
  open?: boolean
  setOpen?: (bool: boolean) => void
  trigger?: React.ReactNode
  wallet: Tables<'wallet'>
}

const ClaimBonusModal = ({ open, setOpen, trigger, wallet }: ClaimBonusModalProps) => {
  return (
    <DynamicModal open={open} setOpen={setOpen} trigger={trigger} dialogOnly>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className='flex flex-col py-2 gap-y-4 items-center justify-center text-center'>
          <div className='h-12 w-12 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
            <GiftIcon size={16} />
          </div>

          <h2 className='text-lg font-semibold tracking-tighter text-center'>
            You have <b className='font-bold'>{formatDataAmount(wallet?.cashback_balance! * DATA_MB_PER_NAIRA)}</b> bonus data.
          </h2>

          <h2 className='text-sm tracking-tighter text-center'>You can use your bonus by following the steps below:</h2>

          <div className='flex flex-col'>
            <div className='flex flex-row justify-between gap-x-1.5 mt-4'>
              <DialogClose asChild>
                <Button variant={'secondary'} className='rounded-full'>
                  <LucideX className='text-pink-500 mr-1' />
                  <span>Forget it</span>
                </Button>
              </DialogClose>

              <Button variant={'secondary'} className='rounded-full ' asChild>
                <Link href={'/dashboard/data?action=claim'} className='flex items-center gap-x-1'>
                  <span>Select Plan</span>
                  <LucideArrowBigRight className='text-amber-500' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </DynamicModal>
  )
}

export default ClaimBonusModal
