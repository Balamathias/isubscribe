import React from 'react'
import { Metadata } from 'next'
import About from '@/components/info/about'

export const metadata: Metadata = {
  title: 'About | isubscribe',
  description: 'We are a utility payments platform that offer affordable data and airtime subscriptions. Buy data and airtime at cheaper rates.'
}

const AboutPage = () => <About />

export default AboutPage