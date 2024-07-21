"use client"

import React from 'react'
import SelectTvProvider from '../SelectTvProvider'


const TVContent = () => {

  return (
    <div className='flex-col gap-y-2 md:gap-y-2 max-sm:w-[90vw] w-[600px] '>
        {/* <div className='flex flex-col gap-y-4 py-4 '> */}
            {/* <div className='flex flex-col gap-y-2 items-center '> */}
                <SelectTvProvider />
            {/* </div> */}
        {/* </div> */}
    </div>
  )
}

export default TVContent