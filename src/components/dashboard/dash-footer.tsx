'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DashFooter = () => {

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full py-6 backdrop-blur-md"
    >
      <div className="flex items-center justify-center w-full gap-x-4">
        <Link href={`https://x.com/isubscribe_ng`} target='_blank' className='h-12 w-12 rounded-full bg-secondary flex items-center justify-center'>
          <Image src={`/glass/icons/X.png`} alt='Facebook' width={24} height={24} />
        </Link>
        <Link href={`https://facebook.com/search/top?q=isubscribe_ng`} target='_blank' className='h-12 w-12 rounded-full bg-secondary flex items-center justify-center'>
          <Image src={`/glass/icons/Facebook.png`} alt='Facebook' width={24} height={24} />
        </Link>
        <Link href={`https://instagram.com/isubscribe_ng`} target='_blank' className='h-12 w-12 rounded-full bg-secondary flex items-center justify-center'>
          <Image src={`/glass/icons/Instagram.png`} alt='Instagram' width={24} height={24} />
        </Link>
        <Link href={`https://chat.whatsapp.com/FtUv7tE95Bt4vPbZ3DbNLS`} target='_blank' className='h-12 w-12 rounded-full bg-secondary flex items-center justify-center'>
          <Image src={`/glass/icons/Whatsapp.png`} alt='WhatsApp' width={24} height={24} />
        </Link>
      </div>

      <div className='flex items-center justify-center gap-x-3 mt-2.5'>
        <div className='flex items-center gap-x-1'>
          <Link href='/privacy-policy' className='text-muted-foreground hover:text-violet-500 transition-all'>
            Privacy
          </Link>
          <span className='text-muted-foreground'>|</span>
          <Link href='/about' className='text-muted-foreground hover:text-violet-500 transition-all'>
            About
          </Link>
          <span className='text-muted-foreground'>|</span>
          <Link href='/terms-and-conditions' className='text-muted-foreground hover:text-violet-500 transition-all'>
            Terms & Conditions
          </Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default DashFooter;