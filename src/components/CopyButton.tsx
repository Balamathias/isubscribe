'use client'


import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import { LucideCopy, LucideCopyCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CopyButton = ({ className, content }: { className?: string, content: string }) => {
    const { handler, copied } = useCopyToClipboard()
  return (
    <Link 
        href={'#'} 
        className={cn('text-xs tracking-tight text-violet-950 flex items-center space-x-1 bg-white md:p-2.5 p-1.5 rounded-full md:px-5 px-2.5 w-fit hover:bg-violet-100 hover:transition-all', className)}
        onClick={(e) => handler(content)}
    >
        {
            copied ? (
                <>
                    <LucideCopyCheck size={18} />
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <LucideCopy size={18} />
                    <span>Copy</span>
                </>
            )
        }
    </Link>
  )
}

export default CopyButton
