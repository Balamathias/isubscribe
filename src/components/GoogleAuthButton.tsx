'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'
import { signInWithOAuth } from '@/lib/supabase/user.actions'
import LoadingOverlay from './loaders/LoadingOverlay'

const GoogleAuthButton = () => {
  const [pending, setPending] = useState(false)
  const handleSignIn = async () => {
    try {
      setPending(true)
      await signInWithOAuth('google')
    } catch (error) {
      console.error(error)
      toast.error('Sign In failed, please try again.')
      setPending(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
    {
      pending && <LoadingOverlay isPending={pending} />
    }
      <Button 
        className='flex items-center border-none shadow-none justify-center space-x-2 w-full my-4 py-4 h-10 md:h-12 rounded-lg'
        variant={'secondary'}
        onClick={handleSignIn}
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