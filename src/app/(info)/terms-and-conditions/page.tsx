import TermsAndConditions from '@/components/info/terms-and-conditions'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Terms and conditions | isubscribe',
  description: 'We are a utility payments platform that offer affordable data and airtime subscriptions. Buy data and airtime at cheaper rates on isubscribe today!'
}
const TermsPage = () => {
  return (
    <TermsAndConditions />
  )
}

export default TermsPage