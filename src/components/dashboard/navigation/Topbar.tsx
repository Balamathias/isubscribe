'use client'

import React from 'react'
import BackButton from '@/components/BackButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Tables } from '@/types/database'
import { usePathname } from 'next/navigation'
import { LucideBadgeHelp } from 'lucide-react'
import Logo from '@/components/Logo'
import ProfileDropdown from '../ProfileDropdown'
import SignOutComponent from '@/components/auth/SignOutComponent'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'

const Topbar = ({ profile: data }: { profile: Tables<'profile'>}) => {
  const pathname = usePathname()
  const { data: profile, isPending } = useGetProfile()

  if (isPending) return <LoadingOverlay />

  return (
    <div className='flex fixed w-full top-0 right-0 left-0 z-10 md:h-20 h-16 items-center justify-center bg-white dark:bg-background shadow-sm'>
      <div className='flex flex-row items-center justify-between p-3 w-full'>

        <div className=' md:ml-[220px]'>
        {
          pathname === '/dashboard' ? (<>
            <Link href={'#support'} className='text-primary md:flex items-center flex-row gap-x-1 hidden'>
              <LucideBadgeHelp size={28} strokeWidth={2} className='text-primary' />
              <span>Support?</span>
            </Link>
            <Logo showLogoText={false} className='flex md:hidden' />
          </>) : <BackButton />
        }
        </div>

        <ProfileDropdown
          trigger = {
            <Link passHref href={'#profile'} className='cursor-pointer hover:opacity-80 flex items-center gap-x-1'>
              <span className='text-muted-foreground text-xs'>Hi <span className="font-semibold">{data?.full_name}</span></span>
              <Avatar title={data?.full_name ?? ''}>
                <AvatarImage src={data?.avatar!}/>
                <AvatarFallback>{data?.full_name?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
          }
        >
          <div className='flex flex-col gap-y-2'>
            <Link href={'#'}>Profile</Link>
            <SignOutComponent profile={profile?.data!} />
          </div>
        </ProfileDropdown>
      </div>
    </div>
  )
}

export default Topbar
