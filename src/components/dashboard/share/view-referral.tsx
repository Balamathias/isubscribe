'use client'

import DynamicModal from '@/components/DynamicModal'
import { Button } from '@/components/ui/button'
import { useClaimReferralBonus } from '@/lib/react-query/funcs/share'
import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { Tables } from '@/types/database'
import { GiftIcon, Sparkles } from 'lucide-react'
import React from 'react'

interface Props {
    referral: Tables<'referrals'> & { profile: Partial<Tables<'profile'>> | null }
}
const ViewReferral = ({ referral }: Props) => {

  const { mutate: claimReferral, isPending } = useClaimReferralBonus()
  
  return (
    <DynamicModal
        trigger={
            <Button className={cn('bg-pink-100 text-black rounded-full hover:opacity-70 hover:bg-white', {
                'bg-sky-300': referral?.status === 'verified'
            })}>
                {referral?.status === 'verified' ? "Claim" : "View"}
            </Button>
        }
        hideDrawerCancel
    >
      <div className='flex flex-col gap-y-4 items-center justify-center text-center'>
        <div className='flex w-full items-center justify-center'>
            <div className={cn('w-16 h-16 bg-amber-600/15 text-amber-600 flex items-center justify-center rounded-full', {
                'bg-green-600/15 text-green-600': referral.status === 'verified',
                'bg-sky-600/15 text-sky-600': referral.status === 'claimed',
            })}>
                <GiftIcon size={24} />
            </div>
        </div>
            <div className='flex flex-row gap-x-3 w-full'>
                <div className='flex flex-col gap-y-1'>
                    <span className='text-sm font-semibold'>{referral.profile?.full_name}</span>
                    
                    {
                        referral.status === 'pending' ? (
                            <span className='text-xs font-normal text-gray-500'>You shared your referral link with User <i className="italics font-semibold">{referral.profile?.email}</i>. Waiting for their first transaction. You will be able to claim your bonus once <i className="italics font-semibold">{referral.profile?.email}</i> performs their first transaction such as funding their wallet.</span>
                        ): (
                            <span className='text-xs font-normal text-gray-500'>You shared your referral link with User <i className="italics font-semibold">{referral.profile?.email}</i> and they have successfully completed their first transaction.</span>
                        )
                    }
                </div>
            </div>

            <div className='w-full flex py-2'>
                <Button
                    className='rounded-full bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1 w-full'
                    variant={'secondary'}
                    size={'lg'}
                    disabled={!(referral.status === 'verified') || isPending}
                    onClick={() => claimReferral(referral.id)}
                >
                    {referral.status === 'claimed' ? (
                        'Claimed'
                    ) : isPending ? (
                        'Claiming...'
                    ) : (
                        <>
                            {`Claim My ${formatDataAmount((referral?.reward || 0) * DATA_MB_PER_NAIRA)}`}
                            <Sparkles size={16} />
                        </>
                    )}
                </Button>
            </div>
      </div>
    </DynamicModal>
  )
}

export default ViewReferral
