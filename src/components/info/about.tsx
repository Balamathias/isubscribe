'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BarChart2Icon, CreditCardIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/info/footer'

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const features = [
    { icon: BarChart2Icon, title: 'Analytics', description: 'Track your subscriptions and spending habits with ease.' },
    { icon: CreditCardIcon, title: 'Cost Management', description: 'Optimize your subscription costs and save money.' },
    { icon: UsersIcon, title: 'Team Collaboration', description: 'Manage subscriptions for your entire team or organization.' },
  ]

  const services = [
    "Cheap Data Subscriptions with massive Data Bonus",
    "Airtime top up with massive Data Bonus",
    "Electricity top up with massive Data Bonus",
    "TV Cable Subscriptions with massive Data Bonus",
    "WAEC/JAMB/NECO pins with massive Data Bonus"
  ]

  const overviewContent = [
    "Isubscribe is a Bill Payment Platform with the Vision to steamline a faster, secure and reliable utility payments processing.",
    "We have chosen to engage the very best and modern technologies for this purpose and you can pay your utitlity bills now with massive discount prices and a whoping Data Bonus for every Successful Transactions and Zero Wallet Funding Fee.",
    "Pay your utility bills with just a single click. We currently offer the following services:",
    "We cherish and honor our Customers, we demonstrate this through Data and Airtime Giveaways every weekends. With us, you can always stay connected with your loved ones."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8 flex flex-col gap-y-6 justify-between">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500"
          {...fadeIn}
        >
          About isubscribe
        </motion.h1>
        
        <motion.p
          className="text-xl text-center mb-12 max-w-3xl mx-auto"
          {...fadeIn}
        >
          {['isubscribe is your all-in-one solution for managing and optimizing your subscriptions. ',
            'Say goodbye to forgotten renewals and hello to smarter spending.'].map((sentence, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300"
              {...fadeIn}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: index === 0 ? 'rgba(236, 72, 153, 0.2)' : 
                                   index === 1 ? 'rgba(59, 130, 246, 0.2)' : 
                                   'rgba(16, 185, 129, 0.2)',
                  color: index === 0 ? 'rgb(236, 72, 153)' : 
                         index === 1 ? 'rgb(59, 130, 246)' : 
                         'rgb(16, 185, 129)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <feature.icon className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 py-6 px-4 md:px-5 flex flex-col border-none gap-y-4 rounded-lg shadow-none !bg-amber-500/20 text-amber-700 dark:text-amber-300"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.ul 
            className="list-disc pl-6 space-y-4 mb-8 py-10"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          >
            {overviewContent.map((content, index) => (
              <motion.li
                key={index}
                className="text-gray-600 dark:text-gray-400 text-sm sm:text-base marker:text-violet-600 dark:marker:text-violet-400"
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
              >
                {content}
                {index === 2 && (
                  <motion.ul 
                    className="list-disc pl-6 space-y-2 mt-4"
                    variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                  >
                    {services.map((service, serviceIndex) => (
                      <motion.li
                        key={serviceIndex}
                        className="text-gray-600 dark:text-gray-400 text-sm sm:text-base italic marker:text-violet-400 dark:marker:text-violet-300"
                        variants={fadeIn}
                        transition={{ delay: (serviceIndex + 4) * 0.2 }}
                      >
                        {service}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/sign-in"
            className="inline-block bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  )
}

export default About
