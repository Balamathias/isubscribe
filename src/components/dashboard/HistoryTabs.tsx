import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const HistoryTabs = () => {
  return (
    <div>
      <Tabs defaultValue="transactions" className=" max-sm:w-[90vw] w-[600px] space-y-4 ">

        <TabsList className="grid w-full grid-cols-2 gap-4 rounded-xl shadow-none border-none p-2 h-fit">
            <TabsTrigger value="transactions" className={` w-full h-9 max-md:rounded-md rounded-md data-[state=active]:bg-background bg-gray-50 data-[state=active]:text-violet-800 text-lg data-[state=active]:shadow-sm`}>Transactions</TabsTrigger>
            <TabsTrigger value="statistics" className={` w-full h-9 text-lg max-md:rounded-md rounded-md data-[state=active]:bg-background bg-gray-50 data-[state=active]:text-violet-800 data-[state=active]:shadow-sm`}>Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
            {/* <Transactions data={"Transactions"} transactions={history?.data} /> */}
        </TabsContent>

        <TabsContent value="statistics">
            {/* <Statistics data={"Statistics"} /> */}
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default HistoryTabs
