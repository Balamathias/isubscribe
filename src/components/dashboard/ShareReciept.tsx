import React from 'react'
import Link from 'next/link'
import { Share2 } from 'lucide-react'
import { StarFilledIcon } from '@radix-ui/react-icons'
import Feedback from './feedback'
import { useNetwork } from '@/providers/data/sub-data-provider'

const ShareReciept = ({ freeData, historyId: incomingId }: { freeData: string, sLink?: string, rLink?: string, historyId?: string }) => {
  const { historyId } = useNetwork()
  return (
    <div className="flex flex-col gap-y-3">
        <span className='text-sm mb-[-4px] text-center'>You have also received {freeData} Data Bonus</span>
        
        <div className=' flex flex-row gap-3 items-center w-full'>
        <Link href={`/dashboard/history/${historyId || incomingId}`} className=' hover:opacity-70 hover:transition-all flex ring-1 max-md:gap-2 shadow-none border-none rounded-xl flex-row gap-4 p-4 max-sm:p-2 items-center justify-center w-full '>
            <span className="text-green-600 rounded-full bg-green-600/20 w-8 h-8 flex items-center justify-center">
              <Share2 size={15} />
            </span>
            <span className=' text-nowrap max-sm:text-sm'>View Reciept</span>
        </Link>
        <Feedback 
          trigger={
            <button className=' hover:opacity-70 hover:transition-all ring-1 shadow-none border-none rounded-xl  flex flex-row gap-4 max-md:gap-2 items-center justify-center p-4 max-sm:p-2 w-full outline-none focus:outline-none'>
                <span className="text-yellow-600 py- rounded-full bg-yellow-600/20 w-8 h-8 flex items-center justify-center">
                  <StarFilledIcon  />
                </span>
                <span className=' text-nowrap max-sm:text-sm'>Give Us a Star</span>
            </button>
          }
        />
        </div>
    </div>
  )
}

export default ShareReciept