import Logo from '@/components/Logo'
import React, { PropsWithChildren } from 'react'

const InfoLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col w-full h-full'>
        {children}

        <footer className='flex items-center py-5 px-4 justify-between w-full bg-secondary'>
          <Logo />

          <p className='text-muted-foreground whitespace-nowrap'>&copy; iSubscribe {new Date().getFullYear()}.</p>
        </footer>
    </div>
  )
}

export default InfoLayout