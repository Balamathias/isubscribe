"use client"

import { electricServices } from '@/utils/constants/electricity-plans';
import React, { useState } from 'react';
import ElectricityProviderSelector from './electricity/ElectricityProviderSelector';
import SmartcardAndMobileInput from './electricity/SmartcardAndMobileInput';
import { useElectricity } from '@/providers/electricity/electricity-provider';

const SelectElectricityProvider = () => {

  return (
    <div className="max-sm:w-[90vw] w-[600px] space-y-4">
      <ElectricityProviderSelector />
      <SmartcardAndMobileInput 
      />
    </div>
  );
};

export default SelectElectricityProvider;


// import React, { useEffect, useState } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
// import Image from 'next/image'
// import { useTvCable } from '@/providers/tv-cable/tv-cable-provider'
// import { Card } from '../ui/card'
// import { Check, CheckCircle, Loader, Loader2, LucideArrowDown, Tv, User, X } from 'lucide-react'
// import { Input } from '../ui/input'
// import { dstv_subscription, gotv_subscription, showmax_subscription, startimes_subscription } from '@/utils/constants/tv-plans'
// import { SubTvPayload, TvCables } from '@/types/tv-cable'
// import { Button } from '../ui/button'
// import TvCards from './tv-cable/tv-cards'
// import { verifySmartcardNumber } from '@/lib/vtpass/services'
// import ElectricityCards from './electricity/electricity-cards'
// import DynamicModal from '../DynamicModal'
// import { Switch } from '../ui/switch'
// import { electricServices } from '@/utils/constants/electricity-plans'





// const SelectElectricityProvider = () => {
//     const [open, setOpen] = React.useState(false)
//     const [selected, setSelected] = useState(electricServices[0])

//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(false)
//     const [success, setSuccess] = useState(false)
//     const [data, setData] = useState(null)

//     const { currentProvider, mobileNumber, setMobileNumber, setCurrentProvider, smartcardNumber, setSmartcardNumber } = useTvCable()
//     const payload = {
//       serviceID:currentProvider,
//       billersCode:smartcardNumber
//     }

//     const handleSmartcardNumberChange = (e:any) => {
//       const value = e.target.value;
//       if (/^\d{0,10}$/.test(value)) {
//         setSmartcardNumber(value);
//       }
//     };

//     const handleCardClick = (item: any) => {
//       setSelected(item);
//       setTimeout(() => {
//         setOpen(false); // Close the modal
//       }, 500);
//     };

//     const isSmartCardNumberNotLessThanOne = smartcardNumber?.length !== 0

//     console.log("SSSSS", selected)

   

//     const handleVerifySmartCard = async () => {
//       setLoading(true)
//       setSuccess(false)
//       setError(false)
//       const res = await verifySmartcardNumber(payload)
//       setData(res?.content)
//       if(res?.content?.Customer_Name){
//         setSuccess(true)
//         setError(false)
//         setLoading(false)
//       }
//       if(res?.content?.error){
//         setError(true)
//         setSuccess(false)
//         setLoading(false)
//       }
//       console.log("22222", res)
//       setLoading(false)
//     }

//     useEffect(() => {
//       if (smartcardNumber?.length === 10 ) {
//         handleVerifySmartCard()
//       }
//     }, [smartcardNumber]);

//   return (
//     <div className="max-sm:w-[90vw] w-[600px] space-y-4">
//     <div 
//       onClick={() => setOpen(true)}
//       className=' bg-gray-300 text-gray-800 hover:opacity-85 hover:transition-all p-2 rounded-sm cursor-pointer'
//       >
//          <div className='flex flex-row justify-between items-center space-y-3 dark:bg-card/60  border-none shadow-none outline-none '>
//             <div className="flex flex-row space-x-3 items-center">
//                <Image src={"/images/tv-cables/ds-tv-logo.jpg"} height={1000} width={1000} alt={"name"} className="h-10 w-10 rounded-md object-cover" />
//                 <span className="text-xs text-gray-700 dark:text-gray-400">{selected?.fullName} Distribution Company</span>
//             </div>
//             <LucideArrowDown className='w-6 h-6 text-gray-700 dark:text-gray-400' />
//         </div>
//     </div>

//     <Card className="bg-white p-4 flex flex-col gap-3  justify-cente w-full">
//        <div className='flex flex-row gap-2  justify-center'>
//           <span className="text-white p- rounded-full bg-violet-500 p-1 md:p-2">
//           <Tv />
//           </span>
//           <Input 
//           onChange={handleSmartcardNumberChange}  
//           value={smartcardNumber}
//           type="tel" 
//           placeholder="Enter Decoder Number here..."
//               />
//        </div>

//        {
//         loading &&
//          (
//           <div className='flex flex-row gap-2  justify-cente items-center'>
//           <span className="text-violet-600 p- rounded-full bg-white p-1 md:p-2">
//           <Loader2 className=' animate-spin' />
//           </span>
//           <span className=' h-8 w-full bg-gray-300 rounded-sm animate-pulse'></span>
//          </div>
//         ) 
//       }
        
//       { success && isSmartCardNumberNotLessThanOne &&
//         (
//           <div className='flex flex-row gap-2  justify-cente items-center'>
//           <span className="text-violet-600 p- rounded-full bg-green-100 p-1 md:p-1">
//           <Check className=' text-green-500' />
//           </span>
//           <span className=' '> {data?.Customer_Name}</span>
//          </div>

//         )
//        }
//       { error && isSmartCardNumberNotLessThanOne &&
//         (
//           <div className='flex flex-row gap-2  justify-cente items-center'>
//           <span className="text-violet-600 p- rounded-full bg-red-100 p-1 md:p-1">
//           <X className=' text-red-500' />
//           </span>
//           <span className=' '> {data?.error}</span>
//          </div>

//         )
//        }
      
//     </Card>
//     <Card className="bg-white p-4 flex flex-row gap-2  justify-center w-full">
//         <span className="text-white p- rounded-full bg-violet-500 p-1 md:p-2">
//         <User />
//         </span>
//         <Input 
//         onChange={(e) => setMobileNumber(e.target.value)}  
//         type="tel" 
//         defaultValue={mobileNumber}
//         placeholder="Enter Phone Number here..."
//             />
//     </Card>



//        {
//         open && 
//         <DynamicModal
//         open={open}
//         setOpen={setOpen}
//         dismissible
//         dialogClassName={'sm:max-w-[640px] md:max-w-[550px] '}
//       >
//         <div className=' h-[400px] overflow-y-auto'>
//         {electricServices.map(service => (
//           <Card 
//             key={service.serviceID} 
//             onClick={() => handleCardClick(service)}
//             className='flex flex-row justify-between  items-center cursor-pointer hover:opacity-90 space-y-3 dark:bg-card/60 border-none shadow-sm p-2 rounded-md outline-none'>
//             <div className="flex flex-row space-x-3 items-center">
//               <Image src={service.image} height={1000} width={1000} alt={service.fullName} className="h-10 w-10 rounded-md object-cover" />
//               <span className="text-xs text-gray-700 dark:text-gray-400">{service.fullName}</span>
//             </div>
//             <Switch 
//             defaultChecked={selected?.serviceID === service.serviceID}
//             checked={selected?.serviceID  === service.serviceID}
//             onCheckedChange={() => handleCardClick(service)}
//             />
//           </Card>
//         ))}
//         </div>
//       </DynamicModal>
//         }

//     </div>
//   )
// }

// export default SelectElectricityProvider
