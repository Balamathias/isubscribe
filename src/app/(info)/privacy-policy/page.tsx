import PrivacyPolicy from '@/components/info/privacy-policy'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Privacy Policy | isubscribe',
  description: 'Learn about our privacy policy.'
}

const PrivacyPolicyPage = () => {
  return (
    <PrivacyPolicy />
  )
}

export default PrivacyPolicyPage