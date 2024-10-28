'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

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
import { DialogTitle } from '@radix-ui/react-dialog'
import { LucideX } from 'lucide-react'

interface DynamicModalProps {
    children: React.ReactNode,
    trigger?: React.ReactNode,
    open?: boolean,
    setOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((bool: boolean) => void),
    showCloseButton?: boolean,
    dialogClassName?: string,
    drawerClassName?: string,
    dialogOnly?: boolean,
    drawerOnly?: boolean,
    dismissible?: boolean,
    closeModal?: (open?: boolean) => void,
    showDrawerCancel?: boolean
}
const DynamicModal = ({
  children, 
  trigger, 
  open, 
  setOpen, 
  dialogClassName, 
  drawerClassName, 
  showCloseButton, 
  dialogOnly=false, 
  drawerOnly=false, 
  dismissible=true,
  showDrawerCancel=true,
  closeModal
}: DynamicModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if ((isDesktop || dialogOnly) && !drawerOnly) {
    return (
      <Dialog open={open} onOpenChange={closeModal ? closeModal : setOpen} modal>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className={cn("max-sm:max-w-[425px] rounded-xl border-none drop-shadow-md shadow-md focus:border-none outline-none focus-within:border-none dark:bg-slate-900", dialogClassName)}>
          <DialogTitle className="sr-only" />
          <div className="flex flex-col gap-3 p-2.5">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={!showDrawerCancel}>
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent className={cn('flex flex-col  flex-1 gap-3 border-none focus:border-none p-4 max-sm:pb-8 outline-none dark:bg-slate-900', drawerClassName)}>

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

export default DynamicModal