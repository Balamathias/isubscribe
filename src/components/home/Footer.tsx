import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

const Footer = () => {
  return (
    <div className=' flex flex-row items-center justify-between gap-x-4 bg-white h-[60px] bottom-0 py-1 sticky shadow-lg px-3 z-50'>
      <Button asChild className=' rounded-full w-full bg-white text-black ring-1 ring-black font-semibold'>
        <Link href={"/sign-up"}>Sign up</Link>
      </Button>
      <Separator orientation="vertical" className=' w-  my-2' color='#030712' />
      <Button asChild className=' rounded-full w-full' >
        <Link href={"/sign-in"}>Login</Link>
      </Button>
    </div>
  )
}

export default Footer