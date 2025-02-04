import FloatingGiftingButton from '@/components/floating-gifting-button'
import { Metadata } from 'next'
import React, { PropsWithChildren } from 'react'

export const metadata: Metadata = {
    title: 'Welcome to isubscribe dashboard | Buy airtime, data, pay electricity bills with ease, pay your cable subscriptions at discounted rates.',
    description: 'Your home for affordable payment of utility bills. Your personal value is paramount to the very existence of our platform and we are delighted to upholding your personal interest. isubscribe should be your one-stop-shop for all your utility bills. Make it your central home and we are very much delighted to serve your needs accordingly.',
}

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <FloatingGiftingButton />
    </>
  )
}

export default Layout
