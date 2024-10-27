import React, { Suspense } from 'react'
import HeroSection from './hero-section'

import Loader from '@/components/loaders/loader'

const HomePage = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)' }} className='bg-inherit inset-0'>
      <Suspense fallback={<Loader />}>
        <HeroSection />
      </Suspense>
    </div>
  )
}

export default HomePage