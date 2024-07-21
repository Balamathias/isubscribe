import { cn } from '@/lib/utils'
import React from 'react'

interface AuthSeparatorProps {
    rightSeparatorClassName?: string
    leftSeparatorClassName?: string
    seperatorWrapperClassName?: string
    separatorText?: string
}

const AuthSeparator = ({rightSeparatorClassName, leftSeparatorClassName, seperatorWrapperClassName, separatorText}: AuthSeparatorProps) => {
  return (
    <div className={cn("relative my-4", seperatorWrapperClassName)}>
        <div className="absolute inset-0 flex items-center">
            <div className={cn("w-full border-t border-gray-300 dark:border-muted", leftSeparatorClassName)}></div>
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-secondary dark:text-muted-foreground">{separatorText ? separatorText : 'Or with Email and Password'}</span>
        </div>
    </div>
  )
}

export default AuthSeparator
