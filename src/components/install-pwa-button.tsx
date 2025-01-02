'use client'

// src/components/InstallButton.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// @ts-ignore
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string; platform: string }> };

interface InstallButtonProps {
  className?: string;
  onInstallable?: (isInstallable: boolean) => void;
}

const InstallButton: React.FC<InstallButtonProps> = ({ className, onInstallable }) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
      beforeInstallPromptEvent.preventDefault();
      setDeferredPrompt(beforeInstallPromptEvent);
      setIsInstallable(true);
      onInstallable?.(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsLoading(false);
      toast.success('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // setIsLoading(true);
    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    setIsLoading(false);

    console.log(choiceResult)
    
    if (choiceResult.outcome === 'accepted') {
      console.log('App installation has started.');
      setIsLoading(true)
      toast.info('App installation is in progress.');
    } else {
      console.log('App installation dismissed.');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
    onInstallable?.(false);
  };

  if (!isInstallable) return null;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={handleInstallClick}
        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-xs md:text-base"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        {isLoading ? 'Installing...' : 'Install App'}
      </motion.button>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black rounded-full">
          <div className="animate-spin h-6 w-6 border-4 border-t-transparent border-white rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
};

export default InstallButton;
