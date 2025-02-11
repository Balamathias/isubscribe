import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FundWalletBox from '@/components/dashboard/FundWalletBox'
import PlaceHolder from '@/components/place-holder-component'

const FTabs = () => {
  return (
    <div className='w-full'>
      <Tabs defaultValue="wallet" className=" max-sm:w-[90vw] w-[600px] space-y-4 ">

        <TabsList className="grid w-full grid-cols-2 gap-3 p-1.5 rounded-2xl bg-gray-100/50 dark:bg-gray-900/20">
            <TabsTrigger 
                value="wallet" 
                className={`
                    w-full px-6 py-2.5
                    text-sm font-medium
                    rounded-xl
                    transition-all duration-200 ease-in-out
                    data-[state=active]:bg-white
                    data-[state=active]:dark:bg-gray-800
                    data-[state=active]:shadow-sm
                    data-[state=active]:text-violet-600
                    data-[state=active]:dark:text-violet-400
                    hover:bg-white/50
                    dark:hover:bg-gray-800/50
                    dark:text-gray-300
                    outline-none
                    focus:ring-2 ring-violet-400/20
                `}
            >
                Wallet
            </TabsTrigger>
            <TabsTrigger 
                value="other" 
                className={`
                    w-full px-6 py-2.5
                    text-sm font-medium
                    rounded-xl
                    transition-all duration-200 ease-in-out
                    data-[state=active]:bg-white
                    data-[state=active]:dark:bg-gray-800
                    data-[state=active]:shadow-sm
                    data-[state=active]:text-violet-600
                    data-[state=active]:dark:text-violet-400
                    hover:bg-white/50
                    dark:hover:bg-gray-800/50
                    dark:text-gray-300
                    outline-none
                    focus:ring-2 ring-violet-400/20
                `}
            >
                Others
            </TabsTrigger>
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