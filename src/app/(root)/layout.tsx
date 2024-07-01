import { Metadata } from 'next'
import React, { PropsWithChildren } from 'react'

export const metadata:Metadata = {
    title: 'Welcome to iSubscribe Home.',
    description: 'Your home of affordable utility bills.',
}

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
    </>
  )
}

export default Layout
