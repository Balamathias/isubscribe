"use client"

import React, { useEffect } from 'react'
import { Fingerprint } from 'lucide-react'
import useBiometricAuth from '@/hooks/use-biometric-auth'
import { motion } from 'framer-motion'

import { toast } from 'sonner'

import SettingItem from './setting-item'

const EnableBiometricAuth = () => {
  const { isEnabled, enableBiometrics, error } = useBiometricAuth()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleEnableBiometrics = async () => {
    if (!isEnabled) {
      await enableBiometrics()
    }
  }

  return (
    <SettingItem
      title={isEnabled ? 'Biometric Authentication Enabled' : 'Enable Biometric Authentication'}
      description={isEnabled
        ? 'Your account is secured with biometric authentication.'
        : 'Secure your account with biometric authentication.'}
      onClick={handleEnableBiometrics}
      biometric={{isEnabled}}
      icon={<Fingerprint />}
      indicator={
        <motion.div
          animate={isEnabled ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </motion.div>
      }
    />
  )
}

export default EnableBiometricAuth
