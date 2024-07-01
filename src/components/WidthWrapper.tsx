import clsx from 'clsx'
import React from 'react'


interface WidthWrapperProps {
    children: React.ReactNode,
    className?: string,
}

const WidthWrapper = ({ className, children }: WidthWrapperProps) => {
  return (
    <div className={clsx('max-w-7xl py-10 pb-20 px-8 lg:px-10 max-sm:px-2.5 flex flex-col gap-3 justify-center mx-auto w-full', className)}>
        {children}
    </div>
  )
}

export default WidthWrapper