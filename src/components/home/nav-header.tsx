import React from 'react'
import Logo from '../Logo'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ModeToggle } from '../mode-toggle'
import { User } from '@supabase/supabase-js'

const NavHeader = ({ user }: { user: User | null }) => {

  return (
    <div className='flex flex-row justify-center items-center w-full bg-transparent h-[70px] top-0 sticky z-50'>
      <div className='flex max-w-7xl items-center justify-between gap-x-4 w-full'>
        <div>
          <Logo showLogoText textClassName='text-violet-50' imageClassName='text-violet-50'/>
        </div>
        <div className='flex items-center justify-between gap-x-3'>
          <ModeToggle />
          <Button asChild variant={'ghost'} className='text-violet-50 hover:bg-white hover:opacity-75 hover:text-black'>
              <Link 
                href={'/about'} 
                className={``}
              >About us</Link>
          </Button>
          {
          user && 
            <Button asChild variant={'ghost'} className='text-violet-50 hidden md:flex hover:bg-white hover:opacity-75 hover:text-black'>
                <Link 
                  href={'/dashboard'} 
                  className={``}
                >Dashboard</Link>
            </Button>
          }
          {!user && <div className='md:flex hidden flex-row items-center gap-x-2 !text-violet-50'>
              <Button asChild variant={'ghost'} className='hover:bg-white hover:opacity-75 hover:text-black'>
                <Link href={"/sign-up"}>Sign up</Link>
              </Button>
              <Button asChild className='hover:bg-white hover:opacity-75 hover:text-black' variant={'ghost'}>
                <Link href={"/sign-in"}>Login</Link>
              </Button>
            </div>}
        </div>
      </div>
    </div>
  )
}

export default NavHeader