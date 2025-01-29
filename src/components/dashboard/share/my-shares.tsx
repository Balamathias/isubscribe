import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LucideClock10 } from 'lucide-react'
import React from 'react'

const MyShares = () => {
  return (
    <div className='flex flex-col gapy-y-3'>
        <h2 className='text-2xl leading-normal py-1.5 flex items-center flex-wrap gap-2.5 font-semibold'>
            <span>Recent Actions</span>
            <LucideClock10 />
        </h2>

        <div className='flex flex-col gap-y-4'>
            {
                Array.from([0,1,2,4,5]).map(_arr => (
                    <div key={_arr} className='flex flex-row gap-x-3 w-full p-4 rounded-xl shadow-sm bg-card dark:bg-secondary justify-between'>
                        <div className='flex flex-row gap-x-3 w-full'>
                            <Avatar className='ring-1'>
                                <AvatarImage src={`/images/mug.png`} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-y-1'>
                                <span className='text-sm font-semibold'>User {_arr}</span>
                                <span className='text-xs font-normal text-gray-500'>You shared your referral link with User {_arr}.</span>
                            </div>
                        </div>

                        <div className=''>
                            <Button className='bg-pink-100 text-black rounded-full hover:opacity-70 hover:bg-white'>
                                View
                            </Button>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default MyShares