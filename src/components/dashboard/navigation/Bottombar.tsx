"use client"

import { navLinks } from '@/utils/constants/navLinks'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

const Bottombar = () => {
    const searchParams = useSearchParams()

    const pathname = usePathname()

  return (
    <nav className="h-auto bg-white dark:bg-secondary backdrop-blur-md shadow-md md:hidden max-lg:py-1 py-5 max-lg:px-4 px-9 sticky max-md:fixed bottom-0 w-full flex flex-row items-center justify-between z-30">
      {
         navLinks.map((link, idx) => (
            <div key={idx} className=' flex flex-row gap-4'>
                <Link href={link?.href} className={` flex flex-col items-center justify-center`}>
                    <link.icon size={pathname === link?.href ? 24 : 24} className={pathname === link?.href ? " bg-violet-100 dark:bg-secondary p-1 rounded-md text-violet-600  hover:transition-all hover:opacity-80" : " text-violet-800 text-s hover:p-1 hover:bg-violet-50 dark:hover:bg-secondary/80 hover:rounded-md hover:transition-all hover:duration-500"} />
                    <span className=' text-sm'>{link?.tooltip}</span>
                </Link>
            </div>
          ))
        }
    </nav>
  )
}

export default Bottombar