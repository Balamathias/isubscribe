import React from 'react'
import DynamicSheet from '../DynamicSheet'
import { Card } from '../ui/card'
import { DynamicTabs } from '../DynamicTabs'
import OverviewTab from './OverviewTab'
import ServicesTab from './ServicesTab'
import PricingTab from './PricingTab'
import ContactTab from './ContactTab'

const tabs = [
  {
    label:"Overview",
    content: <OverviewTab />
  },
  {
    label:"Services",
    content: <ServicesTab />
  },
  {
    label:"Pricing",
    content: <PricingTab />
  },
  {
    label:"Contacts",
    content: <ContactTab />
  },
]

const AboutUs = ({isDashboard}:{isDashboard?:boolean}) => {
  return (
    <>
     <DynamicSheet 
       trigger={ <button className={`${!isDashboard && "absolute"} rounded-full flex p-2 px-5 py-1 items-center top-2 right-3 justify-center bg-violet-10 dark:bg-card/80 border-[3p] border-dashe ring-1 font-semibol`}>About us</button>}
       >
        <div className=''>
        <Card className='flex justify-between object-cover bg-no-repeat bg-center gap-4 md:gap-7  bg-white dark:bg-card rounded-xl shadow-none drop-shadow-none border-none p-4 md:py-6 items-start flex-col'>
        <div className='flex flex-col space-y-2.5'>
            <h2 className='text-muted-foreground text-[14px] font-semibold text-nowrap'>Introducing You to iSubscribe Community...</h2>
        </div>
        <>
         <DynamicTabs tabs={tabs} />  
        </>
        </Card>
        </div>
     </DynamicSheet>
    </>
  )
}

export default AboutUs