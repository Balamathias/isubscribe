"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Share2, LucideArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Options = 'gift' | 'transfer';

const FloatingGiftingButton = () => {
  // activeOption: 'gift' or 'transfer'
  const [activeOption, setActiveOption] = useState<Options>('gift');
  const [isExpanded, setIsExpanded] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Common panel animation variants
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  // Called when one of the options in the expanded panel is clicked.
  const handleOptionSelect = (option: Options) => {
    setActiveOption(option);
    setIsExpanded(false);
  };

  // Close the panel if a click is detected outside the container.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    // Fixed container for the floating button and its panel.
    <div ref={containerRef} className="fixed bottom-20 right-6 z-50">
      <div className="relative">
        {/* Expandable Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              // Position the panel absolutely so it does not push the floating button.
              className={cn(
                "absolute bottom-20 right-0 p-4 w-72 rounded-xl shadow-lg",
                {
                  'bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-700 dark:to-violet-800': activeOption === 'gift',
                  'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-700 dark:to-orange-800': activeOption === 'transfer',
                }
              )}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {activeOption === 'gift' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Share & Earn
                    </h3>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Invite your friends to join isubscribe and get exclusive rewards.
                    Your friend gets a discount, and you earn data bonuses!
                  </p>
                  <Link
                    href="/dashboard/share"
                    className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600 text-white rounded-md focus:outline-none"
                  >
                    Share Now <Share2 size={18} className="ml-2" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Transfer Money
                    </h3>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Easily transfer funds to other users on isubscribe. Enjoy seamless transactions and instant notifications.
                  </p>
                  <Link
                    href="/dashboard/transfer"
                    className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-md focus:outline-none"
                  >
                    Transfer Now <LucideArrowUpDown size={18} className="ml-2" />
                  </Link>
                </>
              )}

              {/* Option Toggle: allows switching between Gift and Transfer */}
              <div className="mt-4 flex justify-around border-t pt-2">
                <button
                  onClick={() => handleOptionSelect('gift')}
                  className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                  <Gift size={20} />
                  <span>Gift</span>
                </button>
                <button
                  onClick={() => handleOptionSelect('transfer')}
                  className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                >
                  <LucideArrowUpDown size={20} />
                  <span>Transfer</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={() => setIsExpanded((prev) => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          // Change button gradient based on activeOption.
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-xl focus:outline-none animate-pulse ${
            activeOption === 'gift'
              ? "bg-gradient-to-r from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          }`}
          aria-label={activeOption === 'gift' ? "Share and Earn" : "Transfer Money"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeOption === 'gift' ? (
              <motion.div
                key="gift"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Gift size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="transfer"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <LucideArrowUpDown size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingGiftingButton;
