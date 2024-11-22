import PrivacyPolicy from '@/components/info/privacy-policy'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Privacy Policy | isubscribe',
  description: 'We are a utility payments platform that offer affordable data and airtime subscriptions. Buy data and airtime at cheaper rates on isubscribe today!'
}

const PrivacyPolicyPage = () => {
  return (
    <PrivacyPolicy />
  )
}

export default PrivacyPolicyPage