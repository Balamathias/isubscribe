'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import PassPinForm from './PassPinForm'
import DynamicModal from '../DynamicModal'

const OnboardingComponent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlParams = new URLSearchParams(searchParams.toString())
    const action = urlParams.get('action')
    const step = urlParams.get('step')

    const [isPassPin, setIsPassPin] = useState(action === 'onboarding')

  return (
    <div className='flex flex-col space-y-2 min-h-[92vh] items-center justify-center'>
      <DynamicModal
        open={isPassPin}
        dismissible={!isPassPin}
        dialogClassName={'sm:max-w-fit'}
      >
        <PassPinForm onClose={() => setIsPassPin(false)} className='shadow-none drop-shadow-none border-none rounded-none' />
      </DynamicModal>
    </div>
  )
}

export default OnboardingComponent
