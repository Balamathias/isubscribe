'use client'

import React from 'react';
import Link from 'next/link';
import { Info, Lock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tables } from '@/types/database';

interface Props {
  user?: Tables<'profile'> | null;
}

const DashFooter = ({ user }: Props) => {
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
          className="flex space-x-6 mt-6"
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
          &copy; {currentYear} isubscibe. All rights reserved.
        </motion.p>

          {user ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='hidden'
            >
              <Link href="/dashboard" className="text-violet-500 hover:underline">
                Go to Dashboard
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-muted-foreground">Please log in to access more features.</p>
              <Link href="/sign-in" className="mt-2 text-violet-500 hover:underline">
                Sign In
              </Link>
            </motion.div>
          )}
      </div>
    </motion.footer>
  );
};

export default DashFooter;
