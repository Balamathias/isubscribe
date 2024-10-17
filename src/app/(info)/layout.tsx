import Logo from '@/components/Logo'
import React, { PropsWithChildren } from 'react'

const InfoLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col w-full h-full'>
        <div className='min-h-screen'>
          {children}
        </div>
    </div>
  )
}

export default InfoLayout