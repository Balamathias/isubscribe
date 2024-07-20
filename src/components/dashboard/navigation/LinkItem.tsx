'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const LinkItem = ({ link }: { link: {href: string, icon: LucideIcon, tooltip: string } }) => {
    const pathname = usePathname()

    const isActive = useMemo(() => {
        if (pathname.startsWith(link.href) && link.href !== '/dashboard') {
            return true
        }
        return pathname === link.href
    }, [pathname, link.href])

  return (
    <Link className='flex gap-3 flex-col space-y-1 py-1.5 cursor-pointer transition-all' href={link.href}>
        <div className={clsx('flex items-center gap-1.5 justify-between dark:hover:bg-gray-900/90 hover:bg-violet-100 hover:text-violet-950 dark:hover:text-muted-foreground p-2.5 rounded-lg', {'bg-violet-800 text-violet-50': isActive})}>
            <div className='flex items-center gap-1.5' role='link'>
                <link.icon size={18} className='' />
                <span className='truncate'>{link.tooltip}</span>
            </div>
        </div>
    </Link>
  )
}

export default LinkItem