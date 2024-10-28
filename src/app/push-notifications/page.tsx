import React from 'react'

import PushNotificationManager from './push.component'
import InstallPrompt from '@/components/install-prompt'

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}