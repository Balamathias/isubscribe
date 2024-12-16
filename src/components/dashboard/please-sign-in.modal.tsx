'use client'

import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import DynamicModal from '../DynamicModal';
import { ArrowRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const PleaseSignIn = ({ trigger, message }: { trigger: ReactNode, message?: string }) => {
    const [open, setOpen] = useState(false)
  return (
    <DynamicModal trigger={trigger} open={open} setOpen={setOpen}>
      <div className="flex flex-col items-center gap-y-6 p-6">
        <motion.div
          className="text-violet-600 bg-violet-600/20 w-12 h-12 flex items-center justify-center rounded-full"
          initial={{ scale: 0.25 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          <PleaseSignInIcon />
        </motion.div>

        <motion.h1
          className="md:text-2xl text-xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          Please Sign In
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-center text-muted-foreground"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
        >
          {message || `You have to be signed in to be able to complete this action.!`}
        </motion.p>

        <Link href="/sign-in" className='w-full'>

        <Button
            className='rounded-xl bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1'
            variant={'secondary'}
            size={'lg'}
            asChild
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.35 }}
            onClick={() => setOpen(false)}
          >
            Sign In
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </Button>
        </Link>
      </div>
    </DynamicModal>
  );
};

const PleaseSignInIcon: React.FC = () => {
  return (
    <InfoIcon />
  );
};

export default PleaseSignIn;
