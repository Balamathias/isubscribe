"use client"

import { cn } from '@/lib/utils'
import { navLinks } from '@/utils/constants/navLinks'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

const Bottombar = () => {
    const pathname = usePathname()

  return (
    <nav className="h-16 bg-white dark:bg-secondary backdrop-blur-md shadow-md md:hidden max-lg:py-1 py-5 max-lg:px-4 px-9 sticky max-md:fixed bottom-0 w-full flex flex-row items-center justify-between z-30 border-t">
      {
         navLinks.map((link, idx) => (
            <div key={idx} className=' flex flex-row gap-4'>
                <Link href={link?.href} className={` flex flex-col items-center justify-center`}>
                    <link.icon size={pathname === link?.href ? 24 : 25} strokeWidth={2} className={cn( "text-violet-800 text-s hover:p-1 hover:bg-violet-50 dark:hover:bg-secondary/80 hover:rounded-md hover:transition-all hover:duration-500", {
                      "bg-violet-100 dark:bg-secondary p-1 rounded-md text-violet-600 dark:text-violet-400  hover:transition-all hover:opacity-80": pathname === link.href
                    })} />
                    <span className={cn('text-xs md:text-sm', {
                      'text-primary dark:text-violet-400': pathname === link.href
                    })}>{link?.tooltip}</span>
                </Link>
            </div>
          ))
        }
    </nav>
  )
}

export default Bottombar