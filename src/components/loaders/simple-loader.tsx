import { Loader2 } from 'lucide-react'
import React from 'react'

const SimpleLoader = () => {
  return (
    <div className="flex p-6 justify-center items-center">
      <Loader2 className='animate-spin mx-auto my-4' />
    </div>
  )
}

export default SimpleLoader