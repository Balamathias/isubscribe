import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"  
import { cn } from '@/lib/utils'

interface ProfileDropdownProps {
    trigger?: React.ReactNode,
    children: React.ReactNode,
    className?: string
}

const ProfileDropdown = ({
    trigger,
    children,
    className
}: ProfileDropdownProps) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild className='ring-0 focus-within:ring-0 focus:ring-0 hover:ring-0 focus:opacity-80 focus:transition-all focus:duration-300'>
            {trigger ? trigger : 'Open'}
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn('flex flex-col gap-y-2 py-2 px-2 drop-shadow-none border-none rounded-xl shadow-sm', className)}>
            {children}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
