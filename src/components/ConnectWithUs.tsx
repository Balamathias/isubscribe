import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import PrivacyPolicy from './about-us/PrivacyPolicy'

const ConnectWithUs = () => {
  return (
    <div className=' my-6'>
    <div className="my- text-center">
        <h3 className="font-semibold my-2.5">Connect with Us on Social Networks:</h3>
        <div className="flex justify-center space-x-8 py-2 rounded-full p-2 shadow-inner">
          <Link href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
            <Facebook className="w-6 h-6" />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
            <Twitter className="w-6 h-6" />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-300">
            <Instagram className="w-6 h-6" />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-sky-700 transition-colors duration-300">
            <Linkedin className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <PrivacyPolicy />
      <div className='text-muted-foreground text-xs mt-4 sm:text-sm italics text-center underline cursor-pointer '
    >
       <p>Powered By: Dayilo Technologies</p>
    </div>
    </div>
  )
}

export default ConnectWithUs