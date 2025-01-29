'use client'

import DynamicModal from '@/components/DynamicModal';
import { Check, Copy, LucideShare } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'

import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon
  } from "react-share";

interface Props {
    url: string,
    trigger: React.ReactNode
}

const ShareModal = ({ trigger, url }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <DynamicModal
        trigger={trigger}
        title='Share and Earn'
    >
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex items-center gap-2 w-full bg-secondary rounded-full p-2 px-3.5'>
                <input 
                    type="text" 
                    value={url} 
                    readOnly 
                    className='flex-1 bg-secondary outline-none text-sm truncate'
                />
                <button
                    onClick={handleCopy}
                    className='p-2 hover:opacity-70 rounded-md transition-colors'
                    aria-label='Copy link'
                >
                {copied ? (
                    <Check className='w-4 h-4 text-green-500' />
                ) : (
                    <Copy className='w-4 h-4' />
                )}
                </button>
            </div>

          <div className='flex items-center gap-3 w-full justify-between'>
            <FacebookShareButton url={url}>
                <Image src='/glass/icons/Facebook.png' width={40} height={40} alt='Facebook'/>
            </FacebookShareButton>
            <TwitterShareButton url={url}>
                <Image src='/glass/icons/X.png' width={40} height={40} alt='X'/>
            </TwitterShareButton>
            <WhatsappShareButton url={url}>
                <Image src='/glass/icons/Whatsapp.png' width={40} height={40} alt='Whatsapp'/>
            </WhatsappShareButton>
            <TelegramShareButton url={url}>
                <Image src='/glass/icons/Telegram.png' width={40} height={40} alt='Telegram'/>
            </TelegramShareButton>
            <LinkedinShareButton url={url}>
                <Image src='/glass/icons/Linkedin.png' width={40} height={40} alt='Linkedin'/>
            </LinkedinShareButton>
            <EmailShareButton url={url}>
                <EmailIcon size={40} round={true} />
            </EmailShareButton>
          </div>
        </div>
    </DynamicModal>
  )
}

export default ShareModal