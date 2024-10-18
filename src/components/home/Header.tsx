import React from 'react'
import Logo from '../Logo'
import Link from 'next/link'
import { Button } from '../ui/button'
import { getCurrentUser } from '@/lib/supabase/user.actions'

const Header = async () => {

  const {data: {user}} = await getCurrentUser()

  return (
    <div className=' flex flex-row justify-center items-center w-full bg-inherit backdrop-blur-md border-b h-[70px] top-0 sticky shadow-l px-2 z-50'>
      <div className='flex max-w-7xl items-center justify-between gap-x-4 w-full'>
        <div>
          <Logo showLogoText />
        </div>
        <div className='flex items-center justify-between gap-x-3'>
          <Button asChild variant={'secondary'} className='rounded-full w-full dark:bg-secondary bg-white ring-1 font-semibold border-none' size={'lg'}>
              <Link 
                href={'/about'} 
                className={``}
              >About us</Link>
          </Button>
          {!user && <div className='md:flex hidden flex-row items-center gap-x-2'>
              <Button asChild variant={'secondary'} className='rounded-full w-full dark:bg-secondary bg-white ring-1 font-semibold border-none' size={'lg'}>
                <Link href={"/sign-up"}>Sign up</Link>
              </Button>
              <Button asChild className='rounded-full w-full border-none' size={'lg'}>
                <Link href={"/sign-in"}>Login</Link>
              </Button>
            </div>}
        </div>
      </div>
    </div>
  )
}

export default Header