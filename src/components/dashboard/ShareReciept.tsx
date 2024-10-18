import React from 'react'
import { Card } from '../ui/card'
import Link from 'next/link'
import { Share2 } from 'lucide-react'
import { StarFilledIcon } from '@radix-ui/react-icons'
import Feedback from './feedback'

const ShareReciept = ({freeData, rLink, sLink}:any) => {
  return (
    <>
       <Card className='shadow-none bg-secondary/15 dark:bg-secondary/50 border-none rounded-xl  flex flex-row gap-4 p-2 items-center justify-between w-full '>
            <span>Bonus Earned:</span>
            <span> <strong className=' text-sm text-green-600'>+</strong>{freeData} Free Data</span>
        </Card>

        <span className=' text-sm mb-[-4px] text-center animate-pulse'>Thank You for Choosing iSubscribe...</span>
        
        <div className=' flex flex-row gap-3 items-center w-full'>
        <Link href={rLink} className=' hover:opacity-70 hover:transition-all flex ring-1 max-md:gap-2 shadow-none border-none rounded-xl flex-row gap-4 p-4 max-sm:p-2 items-center justify-center w-full '>
            <span className="text-green-600 p- rounded-full bg-green-600/20 p-1 md:p-2">
            <Share2 size={15} />
            </span>
            <span className=' text-nowrap max-sm:text-sm'>Share Reciept</span>
        </Link>
        <Feedback 
          trigger={
            <button className=' hover:opacity-70 hover:transition-all ring-1 shadow-none border-none rounded-xl  flex flex-row gap-4 max-md:gap-2 items-center justify-center p-4 max-sm:p-2 w-full outline-none focus:outline-none'>
                <span className="text-yellow-600 py- rounded-full bg-yellow-600/20 p-1.5 md:p-3">
                <StarFilledIcon  />
                </span>
                <span className=' text-nowrap max-sm:text-sm'>Give Us a Star</span>
            </button>
          }
        />
        </div>
    </>
  )
}

export default ShareReciept