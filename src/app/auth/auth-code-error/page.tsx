import WidthWrapper from '@/components/WidthWrapper'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ErrorPage = () => {
  return (
    <WidthWrapper className="h-screen">
      <div className="overflow-hidden w-full flex items-center justify-center flex-col">
        <Image src="/glass/images/clip.png" width={120} height={120} className='object-cover' alt="Error" />
        <p className="text-lg text-muted-foreground text-center my-2">Seems like the link you followed has expired, Please try again.</p>
        <Link className={cn(buttonVariants(), 'p-6')} href={'/sign-in'}>Return to Sign in</Link>
      </div>
    </WidthWrapper>
  )
}

export default ErrorPage