import React from 'react'
import Marquee from 'react-fast-marquee'

const Announcements = () => {
  return (
    <div className=' flex flex-col gap-2'>
        <h1 className=' text-lg text-gray-950 dark:text-violet-100 font-semibold'>Announcement Channel</h1>
        <div className=' self-center w-full '>
            <Marquee 
                pauseOnHover 
                pauseOnClick 
                speed={50}
                direction="left" 
                className={'text-violet-950 bg-gradient-to-r from-purple-50 via-fuchsia-100 to-purple-100 dark:from-purple-950 dark:via-fuchsia-950 dark:to-purple-950 dark:text-white p-1 py-1 px-2 rounded-full dark:bg-card text-xs tracking-tighter md:text-sm'} 
            >Good to know, Cashback is Now Available for Every Transaction Completed!</Marquee>
        </div>
    </div>
  )
}

export default Announcements