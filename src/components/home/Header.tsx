import React from 'react'
import Logo from '../Logo'
import AboutUs from '../about-us/AboutUs'

const Header = () => {
  return (
    <div className=' flex flex-row justify-between bg-white h-[60px] top-0 sticky shadow-l px-2 z-50'>
      <div>
      <Logo showLogoText />
      </div>
      <div>
        <AboutUs />
      </div>
    </div>
  )
}

export default Header