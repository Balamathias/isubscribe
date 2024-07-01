import { cn } from '@/lib/utils'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({url, showLogoText=true, className, imageClassName, textClassName}: {url?: string, showLogoText?: boolean, className?: string, imageClassName?: string, textClassName?: string}) => {
  return (
    <Link href={'/'} className={clsx("w-full py-2 mx-auto flex items-center gap-x-0.5", className)}>
        <Image
            src={url ? url : "/logo/transparent.png"}
            alt="iSubscribe Logo"
            width={300}
            height={300}
            className={cn("h-12 w-12", imageClassName)}
            quality={100}
        />
        {showLogoText && <h2 className={cn("text-primary font-semibold text-xl", textClassName)}>iSubscribe</h2>}
    </Link>
  )
}

export default Logo
