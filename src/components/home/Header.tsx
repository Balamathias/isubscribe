import React from 'react'
import Logo from '../Logo'
import Link from 'next/link'

const Header = () => {
  return (
    <div className=' flex flex-row justify-between items-center bg-white dark:bg-background border-b h-[70px] top-0 sticky shadow-l px-2 z-50'>
      <div>
      <Logo showLogoText />
      </div>
      <div>
        <Link 
          href={'/about'} 
          className={`rounded-full flex p-2 px-5 py-1 items-center top-2 right-3 justify-center bg-violet-10 dark:bg-card/80 ring-1`}
        >About us</Link>
      </div>
    </div>
  )
}

export default Header