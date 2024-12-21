'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { LucideX } from 'lucide-react'

interface DynamicSheetProps {
    children: React.ReactNode,
    trigger?: React.ReactNode,
    open?: boolean,
    setOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((bool: boolean) => void),
    showCloseButton?: boolean,
    sheetClassName?: string,
    drawerClassName?: string,
    sheetOnly?: boolean,
    drawerOnly?: boolean,
    dismissible?: boolean,
    closeSheet?: (open?: boolean) => void,
    showDrawerCancel?: boolean,
    className?: string
}
const DynamicSheet = ({
  children, 
  trigger, 
  open, 
  setOpen, 
  sheetClassName, 
  drawerClassName, 
  showCloseButton, 
  sheetOnly=false, 
  drawerOnly=false, 
  dismissible=true,
  showDrawerCancel=true,
  className,
  closeSheet
}: DynamicSheetProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if ((isDesktop || sheetOnly) && !drawerOnly) {
    return (
      <Sheet open={open} onOpenChange={closeSheet ? closeSheet : setOpen}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        <SheetContent className={cn("rounded-xl border-none drop-shadow-md shadow-md focus:border-none outline-none focus-within:border-none dark:bg-slate-900 ", className, sheetClassName)}>
          <SheetTitle className="sr-only" />
          <div className="flex flex-col gap-3 p-2.5">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={dismissible}>
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent className={cn('flex flex-col  flex-1 gap-3 border-none focus:border-none p-4 max-sm:pb-8 outline-none dark:bg-slate-900', className, drawerClassName)}>

        <DrawerTitle className={cn('bg-transparent hidden', showDrawerCancel && 'flex')} asChild>
          <DrawerClose asChild>
            <Button variant="ghost" className='rounded-full py-2 bg-secondary/25' size={'icon'}>
              <LucideX />
            </Button>
          </DrawerClose>
        </DrawerTitle>

        <div className="flex flex-col gap-3">
            {children}
        </div>
        {showCloseButton && <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="destructive">Close</Button>
          </DrawerClose>
        </DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}

export default DynamicSheet