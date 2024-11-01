"use client"

import React, { useCallback } from 'react'
import { Fingerprint } from 'lucide-react'
import useBiometricAuth from '@/hooks/use-biometric-auth'
import { motion } from 'framer-motion'
import { Tables } from '@/types/database'
import { toast } from 'sonner'
import SettingItem from './setting-item'
import PleaseSignIn from '../please-sign-in.modal'

const EnableBiometricAuth = ({ profile }: { profile?: Tables<'profile'> | null }) => {
  const { isEnabled, enableBiometrics, error } = useBiometricAuth()

  React.useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleEnableBiometrics = useCallback(async () => {
    try {
      if (!isEnabled) {
        if (!window.PublicKeyCredential) {
          toast.info('Your browser does not support biometric authentication')
          return
        }

        // Check if device supports biometrics
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if (!available) {
          toast.info('Your device does not support biometric authentication')
          return
        }

        await enableBiometrics()
        toast.success('Biometric authentication enabled successfully')
      }
    } catch (err) {
      console.error('Biometric enrollment error:', err)
      toast.error('Failed to enable biometric authentication. Please try again.')
    }
  }, [isEnabled, enableBiometrics])

  if (!profile) {
    return (
      <PleaseSignIn
        message='Please sign in to enable biometric authentication'
        trigger={
          <SettingItem
            title='Biometric Authentication'
            description='Disabled, click to enable'
            icon={<Fingerprint />}
          />
        }
      />
    )
  }

  return (
    <SettingItem
      title={isEnabled ? 'Biometric Authentication' : 'Enable Biometric Authentication'}
      description={isEnabled ? 'Enabled' : 'Disabled, click to enable'}
      onClick={handleEnableBiometrics}
      biometric={{ isEnabled }}
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
