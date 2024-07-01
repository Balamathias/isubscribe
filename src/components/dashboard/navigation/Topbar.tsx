'use client'

import React from 'react'
import BackButton from '@/components/BackButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Tables } from '@/types/database'
import { usePathname } from 'next/navigation'
import { LucideBadgeHelp } from 'lucide-react'

const Topbar = ({ profile: data }: { profile: Tables<'profile'>}) => {
  const pathname = usePathname()

  return (
    <div className='flex fixed w-full top-0 right-0 left-0 z-10 h-20 items-center justify-center bg-white dark:bg-background shadow-sm'>
      <div className='flex flex-row items-center justify-between p-3 w-full'>

        <div className=' md:ml-[220px]'>
        {
          pathname === '/dashboard' ? (<>
            <Link href={'#support'} className='text-primary flex items-center flex-row gap-x-1'>
              <LucideBadgeHelp size={22} className='text-primary' />
              <span>Support?</span>
            </Link>
          </>) : <BackButton />
        }
        </div>

        <Link passHref href={'#profile'} className='cursor-pointer hover:opacity-80 flex items-center gap-x-1'>
          <span className='text-muted-foreground text-xs hidden md:block'>Hi <span className="font-semibold">{data?.full_name}</span></span>
          <Avatar title={data?.full_name ?? ''}>
            <AvatarImage src={data?.avatar!}/>
            <AvatarFallback>{data?.full_name?.[0]}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  )
}

export default Topbar
