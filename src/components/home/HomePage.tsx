import React from 'react'
import HeroSection from './HeroSection'

const HomePage = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)' }} className='bg-inherit'>
      <HeroSection />
    </div>
  )
}

export default HomePage