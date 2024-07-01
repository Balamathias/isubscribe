'use client'

import { LinksProps } from '@/utils/sidebarLinks'
import { CaretDownIcon } from '@radix-ui/react-icons'
import React, { useState, useMemo } from 'react'
import SubLinkItem from './SubLinkItem'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Separator } from '../ui/separator'

const LinkItem = ({link}: { link: LinksProps }) => {
    const [expanded, setExpanded] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleClick = () => {
        router.push(link.href)
    }
    const handleExpand = () => {
        setExpanded(prev => !prev)
    }

    const isActive = useMemo(() => {
        if (pathname.startsWith(link.href) && link.href !== '/dashboard') {
            setExpanded(true)
            return true
        }
        return pathname === link.href
    }, [pathname, link.href])

  return (
    <div className='flex gap-3 flex-col space-y-1 py-1.5 cursor-pointer transition-all'>
        <div className={clsx('flex items-center gap-1.5 justify-between dark:hover:bg-gray-900 hover:bg-violet-100 p-2.5 rounded-md', {'bg-primary text-violet-50': isActive})}>
            <div className='flex items-center gap-1.5' role='link' onClick={handleClick}>
                <link.icon size={18} className='' />
                <span className='truncate'>{link.title}</span>
            </div>
            {link?.subLinks?.length && (
            <CaretDownIcon 
                className={clsx('text-muted-foreground w-6 h-6 hover:bg-primary hover:text-white rounded-full', {'rotate-180 duration-75 transition-all': expanded})} 
                onClick={handleExpand}
            />)}
        </div>
        {link?.subLinks?.length && expanded && (
            <div className='flex gap-4'>
                <Separator orientation='vertical' className='h-full ml-4 ' />
                <div className={clsx('flex flex-col gap-1.5 relative', {
                'slide-in-from-top-0 duration-500 transition-all': expanded,
                'slide-out-to-top-0 duration-500 transition-all': !expanded
                    })}>
                        {
                            link.subLinks.map((subLink, index) => (
                                <SubLinkItem key={index} subLink={subLink} />
                            ))
                        }   
                </div>
            </div>
        )}
    </div>
  )
}

export default LinkItem