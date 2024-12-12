import { LucideHeadphones, LucideMail, LucideMessageCircle, LucidePhone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Support = () => {
  return (
    <div className="flex flex-col gap-y-3 p-4">
        <h2 className='md:text-xl text-lg tracking-tighter py-2 font-semibold'>How may we help you?</h2>

        <div className="flex flex-col space-y-4 text-xs tracking-tighter md:text-base">
            <div className='flex flex-row items-center gap-x-2'>
                <LucideMessageCircle className='text-lime-600' />
                <Link className="bg-lime-600/5 text-lime-600 py-1 px-3 rounded-full" href={'https://wa.me/2347049597498?text=Hello+iSubscribe'}>
                    WhatsApp 07049597498
                </Link>
            </div>
            
            <div className='flex flex-row items-center gap-x-2'>
                <LucidePhone className='text-blue-600' />
                <Link className="bg-blue-600/5 text-blue-600 py-1 px-3 rounded-full" href={'tel:+2349154029723'}>
                    Call 09154029723
                </Link>
            </div>

            <div className='flex flex-row items-center gap-x-2'>
                <LucidePhone className='text-pink-600' />
                <Link className="bg-pink-600/5 text-pink-600 py-1 px-3 rounded-full" href={'tel:+2349154029724'}>
                    Call 07049597498
                </Link>
            </div>
            
            <div className='flex flex-row items-center gap-x-2'>
                <LucideMail className='text-purple-600' />
                <Link className="bg-purple-600/5 text-purple-600 py-1 px-3 rounded-full md:text-base" href={'mailto:isubscribenetwork@gmail.com'}>
                    Email isubscribenetwork@gmail.com
                </Link>
            </div>

            <div className='flex flex-row items-center gap-x-2'>
                <LucideHeadphones className='text-green-600' />
                <Link className="bg-green-600/5 text-green-600 py-1 px-3 rounded-full" href={'/dashboard/support/chat'}>
                    Chat iSubscribe Support
                </Link>
            </div>

        </div>
    </div>
  )
}

export default Support