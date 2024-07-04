import React from 'react'
import { Card } from '../ui/card'

interface DataNetworkCardProps {
    Plan_ID: number;
    Type: string;
    Data: string;
    Price: string;
    Duration: string;
    CashBack: string;
}

const DataNetworkCard = ({ data }: { data: DataNetworkCardProps[] }) => {
  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {data?.map((d, idx) => (
            <Card
                key={idx}
                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2"
            >
                <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                    <p className="font-semibold text-base">{d?.Data}</p>
                    <p>{d?.Duration}</p>
                    <p>{d?.Price}</p>
                    <div className="flex flex-row items-center gap-1 text-violet-600 text-xs bg-violet-50 rounded-full px-2 p-1">
                        <span>{d?.CashBack.slice(0, 2)}</span>
                        <span>Cashback</span>
                    </div>
                </div>
            </Card>
        ))}
    </div>
  )
}

export default DataNetworkCard
