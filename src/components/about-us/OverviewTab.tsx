import Image from 'next/image'
import React from 'react'
import AuthTestimonial from '../auth/AuthTestimonials'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import DynamicSheet from '../DynamicSheet'
import PrivacyPolicy from './PrivacyPolicy'
import ConnectWithUs from '../ConnectWithUs'

const OverviewTab = () => {
    return (
        <>
      <Image src={"/images/p5.png"} height={1000} width={1000} alt='Hello' className=' rounded-md' />
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
              <li  className='text-muted-foreground text-xs sm:text-sm italic'>Cheap Data Subscriptions with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm italic'> Airtime top up with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm italic'> Electricity top up with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm italic'> TV Cable Subscriptions with Massive Cashbacks</li>
              <li  className='text-muted-foreground text-xs sm:text-sm italic'>WAEC/JAMB/NECO pins with Massive Cashbacks</li>
            </ul>
        </ul>
        <p  className='text-gray-900 italic text-xs sm:text-sm'>Explore isubscribe network today and I bet, you will chew the bone too.</p>
        <Image src={"/images/p4.jpg"} height={1000} width={1000} alt='Hello' className=' rounded-md' />
        <p  className='text-gray-900 italic text-xs sm:text-sm'>We Cherish and Honor our Customers, We demonstrate this through Data and Airtime Giveaways Every Weekends. With Us, You can always stay connected with your Loved ones.</p>
    
      <ConnectWithUs />
    </>
  )
}

export default OverviewTab