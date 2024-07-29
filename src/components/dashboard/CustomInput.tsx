import { cn } from '@/lib/utils'
import React from 'react'
import { Input } from '../ui/input'

interface CustomInputProps {
    placeholder?: string,
    className?: string,
    value?: string | number,
    defaultValue?: string | number,
    onChange?: (e?: any) => any,
    onKeyDown?: () => void,
    name?: string,
    type?: 'text' | 'number' | 'email' | 'tel'
}

const CustomInput = ({className, ...props}: CustomInputProps) => {
  return (
    <Input 
        {...props}
        className={cn('focus-within:outline h-12 bg-white dark:bg-secondary dark:border dark:border-muted-foreground items-center focus:ring-0 dark:focus:ring-1 focus-within:ring-0 rounded-lg border-none shadow-none drop-shadow-none dark:text-base w-full', className)}
    />
  )
}

export default CustomInput