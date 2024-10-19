'use client'

import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import DynamicModal from '../DynamicModal';
import { LucideX } from 'lucide-react';

const ComingSoon = ({ trigger, message }: { trigger: ReactNode, message?: string }) => {
    const [open, setOpen] = useState(false)
  return (
    <DynamicModal trigger={trigger} open={open} setOpen={setOpen}>
      <div className="flex flex-col items-center gap-y-6 p-6">
        <motion.div
          className="text-violet-500 dark:text-violet-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          <ComingSoonIcon />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          Coming Soon!
        </motion.h1>

        <motion.p
          className="text-lg text-center text-muted-foreground"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
        >
          {message || `We're working hard to bring you this feature. Stay tuned for updates!`}
        </motion.p>

        <motion.button
          className="flex items-center justify-center gap-2 px-4 py-3 bg-violet-500 text-white shadow-lg hover:bg-violet-600 dark:bg-violet-500 dark:hover:bg-violet-600 transition-all ease-in-out duration-300 rounded-full w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.4 }}
          onClick={() => setOpen(false)}
        >
          <LucideX className="h-5 w-5" />
          Close
        </motion.button>
      </div>
    </DynamicModal>
  );
};

const ComingSoonIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c.556 0 1.091-.178 1.534-.504m1.876 2.47A3.992 3.992 0 0112 12a3.992 3.992 0 01-2.876-6.534m-2.47-1.876A4 4 0 118 12a3.992 3.992 0 01-6.534 2.876m10.67-7.44a4 4 0 1110.674 4.588m-2.47-1.876a3.992 3.992 0 01-4.588 10.674m2.47-1.876a4 4 0 11-4.588-10.674"
      />
    </svg>
  );
};

export default ComingSoon;
