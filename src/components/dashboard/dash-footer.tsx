'use client'

import React from 'react';
import Link from 'next/link';
import { Info, Lock, FileText, LucideMapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const DashFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full py-6 backdrop-blur-md"
    >
      <div className="flex flex-col items-center justify-center text-center">

        <motion.div
          className="flex space-x-6 mt-6 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/privacy-policy"
            className="flex items-center text-muted-foreground hover:text-violet-500 transition-all"
          >
            <Lock size={16} className="mr-2" /> Privacy
          </Link>
          <Link
            href="/about"
            className="flex items-center text-muted-foreground hover:text-violet-500 transition-all"
          >
            <Info size={16} className="mr-2" /> About
          </Link>
          <Link
            href="/terms-and-conditions"
            className="flex items-center text-muted-foreground hover:text-violet-500 transition-all"
          >
            <FileText size={16} className="mr-2" /> Terms & Conditions
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 mb-3 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          >
          &copy; {currentYear} isubscribe. All rights reserved.
        </motion.p>

        <motion.p
          className="mt-3 mb-3 text-xs text-muted-foreground flex items-center gap-x-1.5 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          >
          <LucideMapPin /><span>Area 3, Garki, Abuja. +234 915 4029 723, +234 915 4029 724.</span>
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default DashFooter;
