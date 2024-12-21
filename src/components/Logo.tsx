import { cn } from '@/lib/utils'
import clsx from 'clsx'
import { Zap, ZapIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({url, showLogoText=true, className, imageClassName, textClassName}: {url?: string, showLogoText?: boolean, className?: string, imageClassName?: string, textClassName?: string}) => {
  return (
    <Link href={'/'} className={clsx("w-full py-2 mx-auto flex items-center gap-x-0.5", className)}>
        <Zap
          className={cn("h-10 w-10 md:h-12 md:w-12 text-violet-900 dark:text-white", imageClassName)}
          strokeWidth={2}
        />
        {showLogoText && <h2 className={cn("text-primar text-violet-800 font-[550] text-lg md:text-xl dark:text-white", textClassName)}>isubscribe</h2>}
    </Link>
  )
}

export default Logo
