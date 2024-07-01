import Logo from '@/components/Logo'
import WidthWrapper from '@/components/WidthWrapper'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: '404 Page Not Found',
  description: '404 Page Not Found'
}

const PageNotFound = () => {
  return (
    <div className='w-full flex'>
      <WidthWrapper className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col gap-y-3'>
          <h2 className='text-xl font-semibold peer text-gray-500'>404 Page Not Found</h2>
          <p className='text-gray-400 peer peer-hover:opacity-70 peer-hover:transition-all'>The page you are looking for does not exist.</p>

          <Link href='/' className='text-primary peer-hover:text-pink-600 underline translate-all'>
            Return Home
          </Link>

          <Logo />
        </div>
      </WidthWrapper>
    </div>
  )
}

export default PageNotFound
