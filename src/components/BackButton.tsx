'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { LucideArrowLeft } from 'lucide-react'

const BackButton = () => {
    const router = useRouter()

    if (window === undefined ) return <></>
    if (!history.length) return <></>

  return (
    <div className='flex items-center'>
      <Button variant={'ghost'} className='flex items-center flex-row gap-x-1 rounded-full !px-1' onClick={() => router.back()}>
        <LucideArrowLeft />
        <span>Back</span>
      </Button>
    </div>
  )
}

export default BackButton
