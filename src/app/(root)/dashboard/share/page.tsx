import PleaseSignIn from '@/components/dashboard/please-sign-in.modal'
import MyShares from '@/components/dashboard/share/my-shares'
import ShareModal from '@/components/dashboard/share/share-modal'
import { Button } from '@/components/ui/button'
import { getUser } from '@/lib/supabase/accounts'
import { LucideShare } from 'lucide-react'
import React from 'react'

const ShareAndEarnPage = async () => {

  const { data: user } = await getUser()

  return (
    <div className='flex flex-col gap-y-4 md:py-12 mt-16 sm:px-12 px-2 py-4'>
      <div 
        className='h-96 w-full rounded-xl bg-gradient-to-l from-pink-600 via-fuchsia-600 to-sky-600 saturate-200 flex items-center justify-center text-center text-white flex-col gap-y-4'
      >
        {
          user ? (
            <h2 className='text-2xl font-semibold leading-normal'>Hello <b className='bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-gray-100/90 to-white/90'>{user.full_name}</b>, Welcome to Share and Earn.</h2>
          ): (
            <h2 className='text-2xl font-semibold leading-normal'>Share and Earn.</h2>
          )
        }
        <p className='text-lg font-normal leading-normal text-gray-100'>Share your referral link with your friends and earn rewards when they sign up and make a purchase. You can earn up to <b className='font-bold'>300 MB</b> data bonus on every user invited.</p>

        {
          user ? (
            <ShareModal
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/register?referral=${user.id}`}
              trigger={
                <Button size={'lg'} className='bg-white text-black rounded-full hover:opacity-70 hover:bg-white'>
                  Share Now
                  <LucideShare className='ml-2 text-gray-600' size={24} />  
                </Button>
              } />
          ): (
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

      <MyShares />
    </div>
  )
}

export default ShareAndEarnPage