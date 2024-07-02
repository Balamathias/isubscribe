import React, { PropsWithChildren } from 'react'

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='w-full h-full bg-slate-50 dark:bg-background'>
      { children }
    </div>
  )
}

export default AuthLayout
