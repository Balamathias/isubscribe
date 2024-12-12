'use client'

import React from 'react'
import { navLinks } from '@/utils/constants/navLinks'
import Logo from '@/components/Logo'
import LinkItem from './LinkItem'
import SignOutComponent from '@/components/auth/SignOutComponent'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { Button } from '@/components/ui/button'
import { LucideArrowDown } from 'lucide-react'
import Link from 'next/link'

const Sidebar = () => {
  const { data: profile } = useGetProfile()
  return (
    <div className='h-screen md:flex flex-col bg-white dark:bg-background p-2 lg:p-2.5 hidden w-[180px] custom-scrollbar justify-between z-20 overflow-hidden left-0 bottom-0 fixed'>
        <div className="flex flex-col space-y-8">
            <Logo className='mb-4'/>

            <nav className='flex flex-col gap-1.5'>
                {
                    navLinks.map((link, index) => (
                        <LinkItem key={index} link={link} />
                    ))
                }
            </nav>
        </div>

        <footer className="p-2 lg:p-2.5 flex gap-3 flex-col">
          {
            profile?.data ? (<SignOutComponent profile={profile?.data!} />): (
              <Button
                  className='rounded-xl bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1'
                  variant={'secondary'}
                  size={'lg'}
                  asChild
              >
                  <Link href="/sign-in">
                    Login
                    <LucideArrowDown size={16} />
                  </Link>
              </Button>
            )
          }
        </footer>
    </div>
  )
}

export default Sidebar