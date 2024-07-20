import { cn } from '@/lib/utils'
import clsx from 'clsx'
import { ZapIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({url, showLogoText=true, className, imageClassName, textClassName}: {url?: string, showLogoText?: boolean, className?: string, imageClassName?: string, textClassName?: string}) => {
  return (
    <Link href={'/'} className={clsx("w-full py-2 mx-auto flex items-center gap-x-0.5", className)}>
        <ZapIcon 
          className={cn("h-10 w-10 md:h-12 md:w-12 dark:text-violet-500/90", imageClassName)}
          strokeWidth={1.5}
        />
        {showLogoText && <h2 className={cn("text-primary font-semibold text-xl dark:text-violet-500/90", textClassName)}>iSubscribe</h2>}
    </Link>
  )
}

export default Logo
