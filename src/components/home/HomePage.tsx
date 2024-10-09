import React from 'react'
import HeroSection from './HeroSection'
import TestimonialsSection from './Testimonials'
import ConnectWithUs from '../ConnectWithUs'

const HomePage = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)' }} className='bg-background px-3'>
      <HeroSection />
      <TestimonialsSection />
      <div>
        <ConnectWithUs />
      </div>
    </div>
  )
}

export default HomePage