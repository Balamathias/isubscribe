'use client'

import React from 'react'


import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface SettingItemProp {
  onClick?: () => void
  icon: React.ReactNode,
  className?: string,
  iconClassName?: string,
  title: string,
  indicator?: React.ReactNode,
  description: string,
  biometric?: {
    isEnabled?: boolean
  }
}

const SettingItem = ({ icon: Icon, className, iconClassName, onClick, biometric, description, title, indicator }: SettingItemProp) => {
  return (
    <motion.button
      className={cn("w-full p-6 bg-card/70 rounded-xl shadow-sm hover:shadow-md transition-shadow", className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={cn("p-3 bg-primary/10 rounded-full text-primary/80", iconClassName)}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          { Icon }
        </motion.div>
        <div className="flex-1 text-left">
          <h2 className="text-base md:text-lg tracking-tighter">
            { title }
          </h2>
          <p className="text-xs text-muted-foreground">
            { description }
          </p>
        </div>
        { indicator }
      </motion.div>
    </motion.button>
  )
}

export default SettingItem