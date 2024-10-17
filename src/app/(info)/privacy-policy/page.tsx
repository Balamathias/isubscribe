'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, LockKeyholeIcon, EyeOffIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-yellow-900 text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
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
            How we use your data
          </motion.h2>
          <motion.p 
            className='text-sm md:text-base'
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            We may use your email and username to auto-create your iSubscribe virtual account when you sign up for the first time, or to verify your identity as the case may be.
          </motion.p>
          <motion.p 
            className='text-sm md:text-base'
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            iSubscribe cannot read your PIN or Password as they are hashed using the bcrypt package. This ensures an additional layer of security for your account.
          </motion.p>
          <motion.p 
            className='text-sm md:text-base'
            {...fadeIn}
            transition={{ delay: 0.6 }}
          >
            We might use your email to update you with news about our recent updates and important service information.
          </motion.p>
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
    </div>
  )
}

export default PrivacyPolicy
