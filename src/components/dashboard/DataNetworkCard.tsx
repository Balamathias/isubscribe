import React, { useState } from 'react'
import { Card } from '../ui/card'
import { airtel_data, etisalat_data, glo_data, mtn_data } from '@/utils/constants/data-plans';
import { useNetwork } from '@/providers/data/sub-data-provider';
import DynamicModal from '../DynamicModal';
import { Button } from '../ui/button';
import { SubDataProps } from '@/types/networks';
import Image from 'next/image';

const object = {
    'mtn': mtn_data,
    'glo': glo_data,
    'airtel': airtel_data,
    '9mobile': etisalat_data
}

const product = {
    'mtn': {
        name: 'MTN',
        image: '/images/networks/mtn.png'
    },
    'glo': {
        name: 'GLO',
        image: '/images/networks/glo.png'
    },
    'airtel': {
        name: 'AIRTEL',
        image: '/images/networks/airtel.png'
    },
    '9mobile': {
        name: '9MOBILE',
        image: '/images/networks/9mobile.png'
    }
}

const DataNetworkCard = () => {
    const { currentNetwork, handleSubData } = useNetwork()
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = useState<SubDataProps | null>(null)

  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {object[currentNetwork]?.map((d, idx) => (
            <Card
                key={idx}
                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2"
                onClick={() => {
                    setSelected(d)
                    setOpen(true)
                }}
            >
                <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                    <p className="font-semibold text-base">{d?.Data}</p>
                    <p>{d?.Duration}</p>
                    <p>{d?.Price}</p>
                    <div className="flex flex-row items-center gap-1 text-violet-600 text-[9px] md:text-xs bg-violet-50 rounded-full px-2 p-1">
                        <span>{d?.CashBack.slice(0, 2)}</span>
                        <span>Cashback</span>
                    </div>
                </div>


            </Card>
        ))}

        {
            open && <DynamicModal
                open={open}
                setOpen={setOpen}
                dismissible
            >
                <div className="flex flex-col gap-y-4">
                    <h1 className="text-lg font-semibold text-violet-700">Data Plan Details</h1>
                    
                    <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Product</p>
                        <p className='flex items-center flex-row gap-x-1'>{product[currentNetwork].name} | 

                            <Image
                                src={product[currentNetwork].image}
                                width={20}
                                height={20}
                                quality={100}
                                alt={currentNetwork}
                                className='h-7 w-7 rounded-full object-cover' 
                            />
                        </p>
                    </div>

                    <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Price</p>
                        <p>{selected?.Price}</p>
                    </div>

                    <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Amount</p>
                        <p>{selected?.Data}</p>
                    </div>

                    <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Duration</p>
                        <p>{selected?.Duration}</p>
                    </div>

                    <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Cashback</p>
                        <p className='px-2 py-1 rounded-full bg-violet-200 text-violet-800'>+{selected?.CashBack}</p>
                    </div>


                    <Button className='w-full rounded-xl' size={'lg'}>Proceed</Button>
                </div>
            </DynamicModal>
        }
    </div>
  )
}

export default DataNetworkCard
