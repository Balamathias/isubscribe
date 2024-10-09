import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { getCurrentUser } from '@/lib/supabase/user.actions'

const Footer = async () => {
  const { data: { user } } = await getCurrentUser()

  return (
    <div className=' flex flex-row items-center justify-between gap-x-4 bg-background h-[60px] bottom-0 py-1 sticky shadow-lg px-3 z-50'>
      {
        user ? (
          <>
            <Button asChild className='rounded-full w-fit float-left' variant={'secondary'} >
              <Link href={"/dashboard"}>Go to dashboard</Link>
            </Button>
          </>
        ): (
          <>
            <Button asChild variant={'secondary'} className='rounded-full w-full dark:bg-secondary bg-white ring-1 ring-black font-semibold'>
              <Link href={"/sign-up"}>Sign up</Link>
            </Button>
            <Separator orientation="vertical" className='my-2' color='#030712' />
            <Button asChild className=' rounded-full w-full' >
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </>
        )
      }
    </div>
  )
}

export default Footer