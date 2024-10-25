"use client"

import React from 'react'
import { Fingerprint } from 'lucide-react'
import useBiometricAuth from '@/hooks/use-biometric-auth'

import SettingItem from './setting-item'

const EnableBiometricAuth = () => {
  const { isEnabled, enableBiometrics, error } = useBiometricAuth()

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
    />
  )
}

export default EnableBiometricAuth
