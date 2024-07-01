'use client'

import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import clsx, { ClassValue } from 'clsx'

interface DynamicSheetProps {
    trigger: React.ReactNode,
    children: React.ReactNode,
    open?: boolean,
    className?: ClassValue,
    onClose?: () => void,
    setOpen?: (open: boolean) => void,
}
  
const DynamicSheet = ({trigger, children, className}: DynamicSheetProps) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
            {trigger}
        </SheetTrigger>
        <SheetContent className={clsx('flex flex-col gap-3 overflow-hidden border-none rounded-md drop-shadow-md shadow-md px-2 py-5 custom-scrollbar', className)}>
           <div className="flex flex-col p-4 px-1 overflow-auto custom-scrollbar">
            {children}
           </div>
        </SheetContent>
    </Sheet>
  )
}

export default DynamicSheet