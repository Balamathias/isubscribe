'use client'

import DynamicModal from '@/components/DynamicModal';
import { Button } from '@/components/ui/button';
import { useUpdateUniqueCode } from '@/lib/react-query/funcs/user';
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
    EmailIcon,
    LinkedinIcon
  } from "react-share";
import { toast } from 'sonner';

interface Props {
    url: string,
    trigger?: React.ReactNode,
    unique_code: string
}

const ShareModal = ({ trigger, url, unique_code }: Props) => {
  const [copied, setCopied] = useState(false);

  const { mutate: updateUniqueCode, isPending } = useUpdateUniqueCode()

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
        trigger={
          trigger || (
            <span>
              <Button 
                size={'lg'} 
                className='bg-white text-black rounded-full hover:opacity-70 hover:bg-white'
                onClick={
                  unique_code ? () => updateUniqueCode({ unique_code }) : () => toast.warning('Please ensure you have generated an isubscribe account before sharing.')
                }
                disabled={isPending}
              >
                  {isPending ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2">⭘</span>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Share Now
                      <LucideShare className='ml-2 text-gray-600' size={24} />  
                    </>
                  )}
              </Button>
            </span>
          )
        }
        title='Share and Earn'
    >
        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <span className="animate-spin text-2xl">⭘</span>
          </div>
        ) : (
          !unique_code ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-2xl">🔓</span>
              <span className="text-lg ml-4">Please ensure you have generated an isubscribe account before sharing.</span>
            </div>) : (
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
                    <LinkedinIcon size={40} round={true} />
                </LinkedinShareButton>
                <EmailShareButton url={url}>
                    <EmailIcon size={40} round={true} />
                </EmailShareButton>
              </div>
            </div>
            )
        )}
    </DynamicModal>
  )
}

export default ShareModal