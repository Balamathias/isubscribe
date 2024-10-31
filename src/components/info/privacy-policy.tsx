'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, LockKeyholeIcon, EyeOffIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Footer from '@/components/info/footer'

const PrivacyPolicy = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const policies = [
    { 
      icon: ShieldCheckIcon, 
      title: 'Data Protection', 
      description: 'We employ industry-standard encryption and security measures to protect your personal information.' 
    },
    { 
      icon: LockKeyholeIcon, 
      title: 'Limited Data Collection', 
      description: 'We only collect essential information needed to provide and improve our services.' 
    },
    { 
      icon: EyeOffIcon, 
      title: 'No Data Sharing', 
      description: 'Your data is never sold or shared with third parties for marketing purposes.' 
    },
  ]

  const privacyDetails = [
    "At iSubscribe Network (https://isubscribe.ng), your privacy is paramount to us. We are committed to respecting your privacy and complying with any applicable law and regulation regarding any personal information we may collect about you.",
    "We collect both information you knowingly provide to us when using our services and promotions, and information that your devices automatically send while accessing our products and services.",
    "When you visit our website, our servers may log standard data provided by your web browser, including your device's IP address, browser type and version, pages visited, and visit timing.",
    "We may request personal information such as name, email address, and phone number to provide our services effectively.",
    "We use Paystack and Monnify for payment processing. When processing payments, some of your data will be shared with these companies, including information necessary to process or support the payment.",
    "We take commercially acceptable steps to protect your personal information from loss, theft, unauthorized access, disclosure, copying, use, or modification.",
    "We retain your personal information only as long as necessary for the purposes set out in this privacy policy, or to comply with legal obligations.",
    "We do not target our services directly at children under the age of 13, and we do not knowingly collect personal information from children under 13.",
    "You have the right to withhold personal information from us, request details of any personal information we hold about you, and opt-out of marketing communications.",
    "We use cookies to collect information about you and your activity across our site to improve your experience.",
    "We may use your email and username to auto-create your iSubscribe virtual account when you sign up for the first time, or to verify your identity as the case may be.",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-yellow-900 text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8 flex flex-col gap-y-6 justify-between">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-200 dark:via-orange-400 dark:to-red-400"
          {...fadeIn}
        >
          iSubscribe Privacy Policy
        </motion.h1>
        
        <motion.p
          className="text-xl text-center mb-12 max-w-3xl mx-auto"
          {...fadeIn}
        >
          {['Your privacy is our top priority. ', 
            'We are committed to protecting your personal information and ensuring transparency in our data practices.'].map((sentence, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: index * 2 }}
            >
              {sentence.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, delay: charIndex * 0.05 + index * 2 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300"
              {...fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: index === 0 ? 'rgba(245, 158, 11, 0.2)' : 
                                   index === 1 ? 'rgba(239, 68, 68, 0.2)' : 
                                   'rgba(16, 185, 129, 0.2)',
                  color: index === 0 ? 'rgb(245, 158, 11)' : 
                         index === 1 ? 'rgb(239, 68, 68)' : 
                         'rgb(16, 185, 129)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <policy.icon className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{policy.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{policy.description}</p>
            </motion.div>
          ))}
        </div>

        <Card className='py-6 px-4 md:px-5 flex flex-col border-none gap-y-4 rounded-lg shadow-none !bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'>
          <motion.h2 
            className='text-base font-semibold md:text-xl'
            {...fadeIn}
          >
            Our Privacy Policy
          </motion.h2>
          <motion.ul 
            className='list-disc pl-6 space-y-4'
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          >
            {privacyDetails.map((detail, index) => (
              <motion.li 
                key={index}
                className='text-sm md:text-base marker:text-yellow-600 dark:marker:text-yellow-400'
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
              >
                {detail}
              </motion.li>
            ))}
          </motion.ul>
        </Card>

        <motion.div
          className="mt-12 text-center"
          {...fadeIn}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg mb-4">
            By using iSubscribe, you agree to our privacy policy and terms of service.
          </p>
          <Link
            href="/terms-and-conditions"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            Read Full Terms of Service
          </Link>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy
