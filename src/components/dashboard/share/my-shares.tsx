import Empty from '@/components/Empty'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserReferrals } from '@/lib/supabase/share'
import { GiftIcon, LucideUsers } from 'lucide-react'
import React from 'react'
import ViewReferral from './view-referral'

const MyShares = async ({ userId }: { userId: string }) => {
  const { data: referrals, error } = await getUserReferrals({id: userId})

  if (!referrals?.length) {
    return (
        <Empty
            title='No Referrals'
            content='You have not referred anyone yet.'
            icon={<GiftIcon />}
            color='blue'
            className='bg-inherit'
        />)
  }

  return (
    <div className='flex flex-col gapy-y-3'>
        <h2 className='text-2xl leading-normal py-1.5 flex items-center flex-wrap gap-2.5 font-semibold'>
            <span>Your Invites</span>
            <LucideUsers />
        </h2>

        <div className='flex flex-col gap-y-4'>
            {
                referrals.map(referral => (
                    
                    <div key={referral.id} className='flex flex-row gap-x-3 w-full p-4 rounded-xl shadow-sm bg-card dark:bg-secondary justify-between'>
                        <div className='flex flex-row gap-x-3 w-full'>
                            <Avatar className='ring-1'>
                                <AvatarImage src={referral.profile?.avatar!} />
                                <AvatarFallback>{referral.profile?.full_name?.at(0)}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-y-1'>
                                <span className='text-sm font-semibold'>{referral.profile?.full_name}</span>
                                <span className='text-xs font-normal text-gray-500'>You shared your referral link with User <i className="italics font-semibold">{referral.profile?.email}</i>.</span>
                            </div>
                        </div>

                        <div className=''>
                            <ViewReferral referral={referral} />
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default MyShares