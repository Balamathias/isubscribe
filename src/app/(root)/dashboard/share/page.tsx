import PleaseSignIn from '@/components/dashboard/please-sign-in.modal'
import MyShares from '@/components/dashboard/share/my-shares'
import ShareModal from '@/components/dashboard/share/share-modal'
import ShareTerms from '@/components/dashboard/share/share-terms'
import { Button } from '@/components/ui/button'
import { getAccount, getUser } from '@/lib/supabase/accounts'
import { REFERRAL_BONUS_MB } from '@/types/constants'
import { createClient } from '@/utils/supabase/server'
import { LucideShare } from 'lucide-react'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Share and Earn on isubcribe",
  description: "Share your referral link with friends and earn rewards. Get up to 300MB data bonus for each successful referral on isubscribe."
}

const ShareAndEarnPage = async () => {
  const supabase = createClient()

  const [{ data: user }, { data: account }] = await Promise.all([
    getUser(),
    getAccount()
  ])

  return (
    <div className='flex flex-col gap-y-4 md:py-12 mt-16 sm:px-12 px-2 py-4'>
      {/* Container with layered backgrounds */}
      <div 
        className='h-96 w-full rounded-xl relative overflow-hidden flex items-center justify-center text-center text-white flex-col gap-y-4 px-2.5 py-4'
      >
        {/* Gradient background layer */}
        <div className="absolute inset-0 bg-gradient-to-l from-pink-500 via-fuchsia-500 to-sky-500 opacity-90"></div>
        {/* Pattern overlay layer */}
        <div 
          className="absolute inset-0 bg-[url('/patterns/diagonal-lines.svg')] bg-repeat opacity-30"
          style={{ backgroundSize: '150px 150px' }}
        ></div>
        {/* Content Layer */}
        <div className="relative z-10 space-y-4">
          {
            user ? (
              <h2 className='text-xl lg:text-2xl font-semibold leading-normal'>
                Hello <b className='bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-gray-100/90 to-white/90'>{user.full_name}</b>, Welcome to Share and Earn.
              </h2>
            ) : (
              <h2 className='text-2xl font-semibold leading-normal'>Share and Earn.</h2>
            )
          }
          <p className='text-sm lg:text-lg font-normal leading-normal text-gray-100'>
            Share your referral link with your friends and earn rewards when they sign up and make a purchase. You can earn up to <b className='font-bold'>{REFERRAL_BONUS_MB}</b> data bonus on every user invited. Read our <ShareTerms /> to understand how it works.
          </p>

          {
            user ? (
              <ShareModal
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/sign-up?referral=${user.unique_code}`}
                unique_code={account?.account_number!}  
              />
            ) : (
              <PleaseSignIn
                trigger={
                  <Button size={'lg'} className='bg-white text-black rounded-full hover:opacity-70 hover:bg-white'>
                    Share Now
                    <LucideShare className='ml-2 text-gray-600' size={24} />  
                  </Button>
                }
                message={`Please sign in or create an account to be able to invite users and earn rewards for it.`}
              />
            )
          }
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <MyShares userId={user?.unique_code!} />
      </Suspense>
    </div>
  )
}

export default ShareAndEarnPage;
