'use client'

import React, { useEffect, useState } from 'react'
import BackButton from '@/components/BackButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Tables } from '@/types/database'
import { usePathname } from 'next/navigation'
import { LucideBadgeHelp, LucideHeadphones, LucideSettings2, LucideShare2 } from 'lucide-react'
import Logo from '@/components/Logo'
import SignOutComponent from '@/components/auth/SignOutComponent'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import DynamicSheet from '@/components/DynamicSheet'
import DynamicModal from '@/components/DynamicModal'
import Support from '../support'
import { ModeToggle } from '@/components/mode-toggle'

const Topbar = ({ profile: data }: { profile: Tables<'profile'>}) => {
  const pathname = usePathname()
  const { data: profile, isPending } = useGetProfile()
  const [openSupport, setOpenSupport] = useState(false)

  useEffect(() => { setOpenSupport(false) }, [pathname])

  if (isPending) return <LoadingOverlay />

  return (
    <div className='flex fixed w-full top-0 right-0 left-0 z-10 md:h-20 h-16 items-center justify-center bg-white dark:bg-gray-900 shadow-sm border-b'>
      <div className='flex flex-row items-center justify-between p-3 w-full'>

        <div className=' md:ml-[220px]'>
        {
          pathname === '/dashboard' ? (<>
            <Link onClick={() => setOpenSupport(true)} href={'#'} className='md:flex items-center flex-row gap-x-1 hidden'>
              <LucideBadgeHelp size={28} strokeWidth={2} className='' />
              <span>Support?</span>
            </Link>
            <Logo showLogoText className='flex md:hidden' />
          </>) : <BackButton />
        }
        </div>


        <div className='flex flex-row gap-x-8 items-center'>
          <ModeToggle className='space-y-0 hidden md:flex' />

          <div className="md:hidden flex items-center justify-center">
            <button onClick={() => setOpenSupport(prev => !prev)} className='bg-transparent border-none focus:outline-none'>
              <LucideHeadphones className='text-foreground'/>
            </button>
          </div>

          <div>
            <DynamicSheet
              trigger = {
                <Link passHref href={'#'} 
                  className='cursor-pointer hover:opacity-80 flex items-center gap-x-1'>
                  <span className='text-muted-foreground text-xs hidden md:block'>Hi <span className="font-semibold dark:text-amber-500/90">{data?.full_name}</span></span>
                  <Avatar title={data?.full_name ?? ''}>
                    <AvatarImage src={data?.avatar!}/>
                    <AvatarFallback>{data?.full_name?.[0]}</AvatarFallback>
                  </Avatar>
                </Link>
              }
              className={'w-[300px] md:w-[320px] h-screen'}
            >
              <div className='flex flex-col gap-y-2 h-full justify-between md:p-3 md:py-1 py-1 p-1.5'>
                <Link passHref href={'#'} 
                  className='cursor-pointer hover:opacity-80 flex items-center gap-x-1 pb-4 py-2'>
                  <Avatar title={data?.full_name ?? ''}>
                    <AvatarImage src={data?.avatar!}/>
                    <AvatarFallback>{data?.full_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-muted-foreground text-sm'>Hi <span className="font-semibold dark:text-amber-500/90">{data?.full_name}</span></p>
                    <p className='text-muted-foreground text-xs'>What do you wish to do today?</p>
                  </div>
                </Link>

                <div className="flex flex-col space-y-3 mt-8">

                  <div className='flex items-center gap-x-2 text-muted-foreground cursor-pointer hover:text-foreground hover:transition-all peer peer-hover:opacity-65'>
                    <LucideSettings2 size={24} strokeWidth={1.5} className='' />
                    <Link href={'#'}>Preferences</Link>
                  </div>

                  <div className='flex items-center gap-x-2 text-muted-foreground cursor-pointer hover:text-foreground hover:transition-all peer peer-hover:opacity-65'>
                    <LucideShare2 size={24} strokeWidth={1.5} className='' />
                    <Link href={'#'}>Share</Link>
                  </div>

                </div>
                
                <div className='mt-auto'>
                  <SignOutComponent profile={profile?.data!} />
                </div>
              </div>
            </DynamicSheet>
          </div>
        </div>
      </div>

      <DynamicModal
        open={openSupport}
        setOpen={setOpenSupport}
        dialogClassName='rounded-2xl'
      >
        <Support />
      </DynamicModal>
    </div>
  )
}

export default Topbar
