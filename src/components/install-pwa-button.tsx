'use client'

// src/components/InstallButton.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner'

// @ts-ignore
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string; platform: string }> };

interface InstallButtonProps {
  className?: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ className }) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
      beforeInstallPromptEvent.preventDefault();
      setDeferredPrompt(beforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', () => setIsInstallable(false));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', () => setIsInstallable(false));
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('App installed successfully');
      toast.success('App installed successfully.')
    } else {
      console.log('App installation dismissed');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) return null;

  return (
    <motion.button
      onClick={handleInstallClick}
      className={`bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-xs md:text-base ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      Install App
    </motion.button>
  );
};

export default InstallButton;
