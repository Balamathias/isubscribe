import React, { PropsWithChildren } from 'react'

const InfoLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col w-full h-full'>
        {children}
    </div>
  )
}

export default InfoLayout