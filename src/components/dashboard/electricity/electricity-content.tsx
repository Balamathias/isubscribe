import React from 'react'
import SelectElectricityProvider from '../SelectElectricityProvider'
import ElectricityCards from './electricity-cards'

const ElectricityContent = () => {
  return (
    <div className=' flex flex-col gap-y-2 md:gap-y-2 max-sm:w-[90vw] w-[600px] '>
        <SelectElectricityProvider />
        <ElectricityCards />
    </div>
  )
}

export default ElectricityContent