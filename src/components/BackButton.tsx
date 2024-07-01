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
      <Button variant={'ghost'} className='flex items-center flex-row gap-x-1 rounded-full' onClick={() => router.back()}>
        <LucideArrowLeft size={18} className='text-primary' />
        <span className='text-muted-foreground'>Back</span>
      </Button>
    </div>
  )
}

export default BackButton
