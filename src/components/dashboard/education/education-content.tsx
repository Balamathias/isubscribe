import React from 'react'
import ElectricityCards from '../electricity/electricity-cards'
import SelectEducationProvider from './SelectEducationProvider'
import EducationCard from './education-cards'
import InputFields from './input-fields'

const EducationContent = () => {
  return (
    <div className=' flex flex-col gap-y-4 md:gap-y-4 max-sm:w-[90vw] w-[600px] rounded-xl'>
        <SelectEducationProvider />
        <InputFields />
        <EducationCard />
    </div>
  )
}

export default EducationContent