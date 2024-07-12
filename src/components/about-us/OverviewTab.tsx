import Image from 'next/image'
import React from 'react'
import AuthTestimonial from '../auth/AuthTestimonials'

const OverviewTab = () => {
  return (
    <>
      <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
            <li className='text-muted-foreground text-xs sm:text-sm'>
            Isubscribe is a Bill Payment Platform with the Vision to steamline a faster, secure and liable utility payments processing.
            </li>
            <li className='text-muted-foreground text-xs sm:text-sm'>
            We have chosen to engage the very best and Morden Technologies for this purpose and you can pay your utitlity bills now with massive discount prices and a Whooping Cashbacks for every Successful Transactions.
            </li>
            <li className='text-muted-foreground text-xs sm:text-sm'>
            Pay your utility bills with just a single click. We currently offer the following services:
            </li>
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
              <li  className='text-muted-foreground text-xs sm:text-sm'>Cheap Data Subscriptions with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm'> Airtime top up with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm'> Electricity top up with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm'> TV Cable Subscriptions with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm'>WAEC/JAMB/NECO pins with Massive Cashbacks</li>
            </ul>
        </ul>
        <Image src={"/images/p4.jpg"} height={1000} width={1000} alt='Hello' className=' rounded-md' />
        <AuthTestimonial sheetOpen />
    </>
  )
}

export default OverviewTab