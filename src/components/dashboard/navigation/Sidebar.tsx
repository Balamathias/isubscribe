'use client'

import React from 'react'
import { navLinks } from '@/utils/constants/navLinks'
import Logo from '@/components/Logo'
import LinkItem from './LinkItem'
import SignOutComponent from '@/components/auth/SignOutComponent'
import { useGetProfile } from '@/lib/react-query/funcs/user'

const Sidebar = () => {
  const { data: profile } = useGetProfile()
  return (
    <div className='h-screen md:flex flex-col bg-white dark:bg-background p-2 lg:p-2.5 hidden w-[220px] custom-scrollbar justify-between z-20 overflow-hidden left-0 bottom-0 fixed'>
        <div className="flex flex-col space-y-8">
            <Logo className='mb-4'/>

            <nav className='flex flex-col gap-1.5 '>
                {
                    navLinks.map((link, index) => (
                        <LinkItem key={index} link={link} />
                    ))
                }
            </nav>
        </div>

        <footer className="p-2 lg:p-2.5 flex gap-3 flex-col">
          <SignOutComponent profile={profile?.data!} />
        </footer>
    </div>
  )
}

export default Sidebar