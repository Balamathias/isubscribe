"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Fingerprint } from 'lucide-react'
import useBiometricAuth from '@/hooks/use-biometric-auth'

const EnableBiometricAuth = () => {
  const { isEnabled, enableBiometrics, error } = useBiometricAuth()

  const handleEnableBiometrics = async () => {
    if (!isEnabled) {
      await enableBiometrics()
    }
  }

  return (
    <motion.button
      className="w-full p-6 bg-card/70 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleEnableBiometrics}
    >
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="p-3 bg-primary/10 rounded-full"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Fingerprint className="w-6 h-6 text-primary/80" />
        </motion.div>
        <div className="flex-1 text-left">
          <h2 className="text-lg md:text-xl tracking-tighter">
            {isEnabled ? 'Biometric Authentication Enabled' : 'Enable Biometric Authentication'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEnabled
              ? 'Your account is secured with biometric authentication.'
              : 'Secure your account with biometric authentication.'}
          </p>
        </div>
        <motion.div
          animate={isEnabled ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-4 h-4 bg-green-500 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

export default EnableBiometricAuth
