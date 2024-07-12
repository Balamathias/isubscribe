import Image from 'next/image'
import React from 'react'

const ServicesTab = () => {
  return (
    <div className=' flex flex-col gap-9'>
      <Image src={"/images/p1.png"} height={1000} width={1000} alt='Hello' />
    </div>
  )
}

export default ServicesTab