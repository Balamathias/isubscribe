import { cn } from '@/lib/utils'
import React, { ComponentProps } from 'react'
import { Input } from '../ui/input'

interface CustomInputProps {
    className?: string,
}

const CustomInput = ({className, ...props}: CustomInputProps & ComponentProps<'input'>) => {
  return (
    <Input 
        {...props}
        className={cn('focus-within:outline h-12 bg-white dark:bg-secondary dark:border dark:border-muted-foreground items-center focus:ring-0 dark:focus:ring-1 focus-within:ring-0 rounded-lg border-none shadow-none drop-shadow-none dark:text-base w-full', className)}
    />
  )
}

export default CustomInput