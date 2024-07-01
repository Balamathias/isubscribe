import WidthWrapper from '@/components/WidthWrapper'
import Image from 'next/image'
import React from 'react'

const ErrorPage = () => {
  return (
    <WidthWrapper className="h-screen ">
      <div className="overflow-hidden w-full flex items-center justify-center flex-col">
        <Image src="/glass/images/clip.png" width={120} height={120} className='object-cover' alt="Error" />
        <p className="text-lg text-muted-foreground">An Error Occured, Please try again... while we are trying to fix it.</p>
      </div>
    </WidthWrapper>
  )
}

export default ErrorPage