import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = ({ className }: { className?: string}) => {
  return (
    <div className={cn('w-screen h-screen flex justify-center items-center bg-violet-50 fixed top-0 bottom-0 right-0 left-0', className)}>
        <Loader2 className='animate-spin text-primary' />
    </div>
  )
}

export default Loading