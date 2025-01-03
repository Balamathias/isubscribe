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
import DynamicModal from '@/components/DynamicModal'
import Support from '../support'
import { ModeToggle } from '@/components/mode-toggle'
import ComingSoon from '../comig-soon'
import { cn, getGreeting } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight, LucideUserCheck, LucideInfo } from 'lucide-react'
import InstallButton from '@/components/install-pwa-button'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'


const Topbar = ({ profile }: { profile?: Tables<'profile'> | null }) => {
  const pathname = usePathname()
  const [openSupport, setOpenSupport] = useState(false)
  const [openProfileActions, setOpenProfileActions] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => { 
    setOpenSupport(false)
    setOpenProfileActions(false)
  }, [pathname])

  return (
    <div className='flex fixed w-full top-0 right-0 left-0 z-10 md:h-20 h-16 items-center justify-center bg-white/60 dark:bg-gray-900/80 shadow-sm border-b backdrop-blur-md'>
      <div className='flex flex-row items-center justify-between p-3 w-full'>

        <div className=' md:ml-[220px]'>
        {
          pathname === '/dashboard' ? (<>
            <Link onClick={() => setOpenSupport(true)} href={'#'} className='md:flex items-center flex-row gap-x-1 hidden'>
              <LucideBadgeHelp size={28} strokeWidth={2} className='' />
              <span>Support?</span>
            </Link>
            <Logo showLogoText textClassName={cn('block', isInstallable && 'max-sm:text-xs')} className='flex md:hidden' />
          </>) : <BackButton />
        }
        </div>


        <div className='flex flex-row gap-x-8 items-center'>
          {!profile && <Button variant="secondary" className='rounded-full hidden md:block' asChild>
              <Link href="/sign-in">Login</Link>
            </Button>}
          {!profile && <InstallButton className={cn('flex', isInstallable && 'max-sm:text-xs')} onInstallable={setIsInstallable} />}

          <ModeToggle className='space-y-0 hidden md:flex' />

          {profile && 
            <div className="md:hidden flex items-center justify-center">
              <button onClick={() => setOpenSupport(prev => !prev)} className='bg-transparent border-none focus:outline-none'>
                <LucideHeadphones className='text-foreground'/>
              </button>
            </div>
          }

          <>
            <DynamicModal
              open={openProfileActions}
              setOpen={setOpenProfileActions}
              hideDrawerCancel
              trigger = {
                <Link passHref href={'#'} 
                  className='cursor-pointer hover:opacity-80 flex items-center gap-x-1'>
                  <span className='text-muted-foreground text-xs hidden md:block'>{getGreeting()}, <span className="font-semibold dark:text-amber-500/90">{profile?.full_name?.split(' ')?.at(0) || 'Guest'}</span>!</span>
                  <Avatar title={profile?.full_name ?? 'Guest'}>
                    <AvatarImage src={profile?.avatar!}/>
                    <AvatarFallback>{profile?.full_name?.[0] || 'G'}</AvatarFallback>
                  </Avatar>
                </Link>
              }
            >
              <div className='flex flex-col gap-y-2 justify-between md:p-3 md:py-1 py-1 p-1.5'>
                <Link passHref href={'#'} 
                  className='cursor-pointer hover:opacity-80 flex items-center gap-x-1 pb-4 py-2'>
                  <Avatar title={profile?.full_name ?? 'Guest'}>
                    <AvatarImage src={profile?.avatar!}/>
                    <AvatarFallback>{profile?.full_name?.[0] || 'G'}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-muted-foreground text-xs'>{profile?.full_name || 'Guest'}</p>
                    <p className='text-muted-foreground dark:text-amber-500 text-sm'>{profile?.email || 'Please sign in to continue'}</p>
                  </div>
                </Link>

                <div className="flex flex-col space-y-3 mt-8">

                  <div className='flex items-center gap-x-2 text-muted-foreground cursor-pointer hover:text-foreground hover:transition-all peer peer-hover:opacity-65'>
                    <span className='w-10 h-10 flex items-center justify-center rounded-full bg-secondary/20 text-foreground'>
                      <LucideSettings2 size={17} strokeWidth={1.5} className='' />
                    </span>
                    <Link href={'/dashboard/settings'}>Preferences</Link>
                  </div>

                  <div className='flex items-center gap-x-2 text-muted-foreground cursor-pointer hover:text-foreground hover:transition-all peer peer-hover:opacity-65'>
                    <span className='w-10 h-10 flex items-center justify-center rounded-full bg-secondary/20 text-foreground'>
                      <LucideUserCheck size={17} strokeWidth={1.5} className='' />
                    </span>
                    <Link href={'/privacy-policy'}>Privacy Policy</Link>
                  </div>

                  <div className='flex items-center gap-x-2 text-muted-foreground cursor-pointer hover:text-foreground hover:transition-all peer peer-hover:opacity-65'>
                    <span className='w-10 h-10 flex items-center justify-center rounded-full bg-secondary/20 text-foreground'>
                      <LucideInfo size={17} strokeWidth={1.5} className='' />
                    </span>
                    <Link href={'/about'}>About us</Link>
                  </div>

                  <div className='flex items-center gap-x-2 text-muted-foreground cursor-pointer hover:text-foreground hover:transition-all peer peer-hover:opacity-65'>
                    <span className='w-10 h-10 flex items-center justify-center rounded-full bg-secondary/20 text-foreground'>
                      <LucideShare2 size={17} strokeWidth={1.5} className='' />
                    </span>
                    <ComingSoon 
                      trigger={<Link href={'#'}>Share and earn</Link>}
                      message='We are working very hard to bring this feature to you. Very soon, you will be able to share and earn.'
                    />
                  </div>

                </div>
                
                <div className='mt-auto'>
                  <SignOutComponent profile={profile} setOpenProfileActions={setOpenProfileActions} />
                </div>

                {
                  !profile && (
                    <Link href="/sign-in" className='w-full'>
                      <Button
                          className='rounded-xl bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1 w-full'
                          variant={'secondary'}
                          size={'lg'}
                          asChild
                      >
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.35 }}
                        >
                          Sign In
                          <ArrowRight className="h-5 w-5" />
                        </motion.button>
                      </Button>
                    </Link>
                  )
                }
              </div>
            </DynamicModal>
          </>
        </div>
      </div>

      {
        (!isinstallable || isDesktop) && (
          <DynamicModal
            open={openSupport}
            setOpen={setOpenSupport}
            dialogClassName='rounded-2xl'
            title="Contact Support"
          >
            <Support />
          </DynamicModal>
        )
      }
    </div>
  )
}

export default Topbar
