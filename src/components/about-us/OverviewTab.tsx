import Image from 'next/image'
import React from 'react'
import AuthTestimonial from '../auth/AuthTestimonials'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import DynamicSheet from '../DynamicSheet'
import PrivacyPolicy from './PrivacyPolicy'

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
        <div className=' lg:hidden'>
         <AuthTestimonial sheetOpen />
        </div>

        <div className="mt-6 text-center">
        <h3 className="text-gray-700 font-semibold mb-2">Connect with Us on Social Networks:</h3>
        <div className="flex justify-center space-x-8 bg-violet-50 rounded-full p-2 shadow-inner">
          <Link href="#" className="text-gray-600 hover:text-violet-500 transition-colors duration-300">
            <Facebook className="w-6 h-6" />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-violet-400 transition-colors duration-300">
            <Twitter className="w-6 h-6" />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-300">
            <Instagram className="w-6 h-6" />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-violet-700 transition-colors duration-300">
            <Linkedin className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <PrivacyPolicy />
    </>
  )
}

export default OverviewTab