import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FundWalletBox from '@/components/dashboard/FundWalletBox'
import PlaceHolder from '@/components/place-holder-component'

const FTabs = () => {
  return (
    <div className='w-full'>
      <Tabs defaultValue="wallet" className=" max-sm:w-[90vw] w-[600px] space-y-4 ">

        <TabsList className="grid w-full grid-cols-2 gap-4 rounded-xl shadow-none border-none py-2 h-fit bg-transparent">
            <TabsTrigger value="wallet" className={` w-full h-9 rounded-xl ring-1 data-[state=active]:bg-background  data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-400/80 md:text-lg data-[state=active]:shadow-none peer bg-gray-50/80 dark:bg-card/70 text-sm`}>Wallet</TabsTrigger>
            <TabsTrigger value="other" className={` w-full h-9 md:text-lg text-sm ring-1 rounded-xl data-[state=active]:bg-background peer-hover:opacity-90  data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-400/80 data-[state=active]:shadow-none bg-gray-50/80 dark:bg-card/70`}>Others</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <FundWalletBox />
        </TabsContent>

        <TabsContent value="other">
            <PlaceHolder />
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default FTabs