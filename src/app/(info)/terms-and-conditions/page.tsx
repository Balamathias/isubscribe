'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon, ScaleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const TermsAndConditions = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const terms = [
    { 
      icon: DocumentTextIcon, 
      title: 'User Agreement', 
      description: 'By using iSubscribe, you agree to abide by these terms and conditions.' 
    },
    { 
      icon: ScaleIcon, 
      title: 'Fair Usage', 
      description: 'Use our services responsibly and in compliance with applicable laws.' 
    },
    { 
      icon: ClockIcon, 
      title: 'Service Availability', 
      description: 'We strive for 99.9% uptime, but cannot guarantee uninterrupted service.' 
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-100 dark:from-gray-900 dark:to-amber-900 text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 dark:from-orange-300 dark:via-amber-400 dark:to-yellow-300"
          {...fadeIn}
        >
          Terms and Conditions
        </motion.h1>
        
        <motion.p
          className="text-xl text-center mb-12 max-w-3xl mx-auto"
          {...fadeIn}
        >
          {['Welcome to iSubscribe. ', 
            'By using our services, you agree to these terms. Please read them carefully.'].map((sentence, index) => (
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
          {terms.map((term, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300"
              {...fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: index === 0 ? 'rgba(249, 115, 22, 0.2)' : 
                                   index === 1 ? 'rgba(245, 158, 11, 0.2)' : 
                                   'rgba(234, 179, 8, 0.2)',
                  color: index === 0 ? 'rgb(249, 115, 22)' : 
                         index === 1 ? 'rgb(245, 158, 11)' : 
                         'rgb(234, 179, 8)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <term.icon className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{term.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{term.description}</p>
            </motion.div>
          ))}
        </div>

        <Card className='py-6 px-4 md:px-5 flex flex-col border-none gap-y-4 rounded-lg shadow-none !bg-orange-500/20 text-orange-700 dark:text-orange-300'>
          <motion.h2 
            className='text-base font-semibold md:text-xl'
            {...fadeIn}
          >
            Key Points
          </motion.h2>
          <motion.ul 
            className='list-disc pl-5 space-y-2'
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            <li>You must be at least 18 years old to use iSubscribe.</li>
            <li>You are responsible for maintaining the security of your account.</li>
            <li>We reserve the right to terminate accounts that violate our terms.</li>
            <li>We may update these terms from time to time. Continued use of iSubscribe after changes constitutes acceptance of the new terms.</li>
          </motion.ul>
        </Card>

        <motion.div
          className="mt-12 text-center"
          {...fadeIn}
          transition={{ delay: 0.8 }}
        >
          <p className="text-lg mb-4">
            If you have any questions about our Terms and Conditions, please contact us.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            Contact Us
          </Link>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          {...fadeIn}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For more information, please read our{' '}
            <Link href="/privacy-policy" className="text-orange-500 hover:text-orange-600 underline">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="/about" className="text-orange-500 hover:text-orange-600 underline">
              About Us
            </Link>
            {' '}pages.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TermsAndConditions
