import TermsAndConditions from '@/components/info/terms-and-conditions'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Terms and conditions | isubscribe',
  description: 'Learn about our terms of usage and conditions.'
}
const TermsPage = () => {
  return (
    <TermsAndConditions />
  )
}

export default TermsPage