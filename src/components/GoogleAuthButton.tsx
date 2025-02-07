'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import { signInWithOAuth } from '@/lib/supabase/user.actions'
import LoadingOverlay from './loaders/LoadingOverlay'
import { useSearchParams } from 'next/navigation'

const GoogleAuthButton = () => {
  const [pending, setPending] = useState(false)

  const searchParams = useSearchParams()

  const referral = searchParams.get('referral')

  const handleSignIn = async () => {
    setPending(true)
    try {
      setPending(true)
      await signInWithOAuth('google', referral!)
    } catch (error) {
      console.error(error)
      toast.error('Sign In failed, please try again.')
      setPending(false)
    }
  }

  return (
    <>
    {
      pending && <LoadingOverlay isPending={pending} />
    }
      <Button 
        className='flex items-center border-none shadow-none justify-center space-x-2 w-full my-4 py-4 h-14 rounded-xl'
        variant={'secondary'}
        onClick={handleSignIn}
        size={'lg'}
      >
          {
            pending && <LoaderIcon className='animate-spin' />
          }
          
          <Image 
            src={'/glass/icons/google-flat.png'}
            alt='Google'
            width={20}
            height={20}
            quality={100}
            className='object-cover'
          />
          <span className="text-muted-foreground">Continue with Google</span>
      </Button>
    </>
  )
}

export default GoogleAuthButton