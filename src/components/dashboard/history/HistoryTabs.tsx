import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import TransactionHistoryComponent from './TransactionHistoryComponent'
import PlaceHolder from '@/components/place-holder-component'

const HistoryTabs = () => {
  return (
    <div className='w-full'>
      <Tabs defaultValue="transactions" className=" max-sm:w-[90vw] w-[600px] space-y-4 ">

        <TabsList className="grid w-full grid-cols-2 gap-4 rounded-xl shadow-none border-none p-2 h-fit bg-transparent">
            <TabsTrigger value="transactions" className={` w-full h-9 max-md:rounded-md rounded-md data-[state=active]:bg-background data-[state=active]:text-violet-800 md:text-lg data-[state=active]:shadow-none peer bg-gray-50/80 text-sm`}>Transactions</TabsTrigger>
            <TabsTrigger value="statistics" className={` w-full h-9 md:text-lg text-sm max-md:rounded-md rounded-md data-[state=active]:bg-background peer-hover:opacity-90 data-[state=active]:text-violet-800 data-[state=active]:shadow-none bg-gray-50/80`}>Statistics</TabsTrigger>
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
