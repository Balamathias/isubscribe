import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import TransactionHistoryComponent from './TransactionHistoryComponent'
import PlaceHolder from '@/components/place-holder-component'

const HistoryTabs = () => {
  return (
    <div className='w-full'>
      <Tabs defaultValue="transactions" className=" max-sm:w-[90vw] w-[600px] space-y-4 ">

        <TabsList className=" hidden w-full grid-cols-2 gap-4 rounded-xl shadow-none border-none p-2 h-fit bg-transparent">
            <TabsTrigger value="transactions" className={`w-full h-9 rounded-full data-[state=active]:bg-background data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-400/80 md:text-lg data-[state=active]:shadow-none peer bg-gray-50/80 dark:bg-card/90 text-sm`}>Transactions</TabsTrigger>
            <TabsTrigger value="statistics" className={`w-full h-9 rounded-full data-[state=active]:bg-background  data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-400/80 md:text-lg data-[state=active]:shadow-none peer bg-gray-50/80 dark:bg-card/90 text-sm`}>Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionHistoryComponent />
        </TabsContent>

        <TabsContent value="statistics">
            <PlaceHolder />
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default HistoryTabs
