"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PaymentMethod } from '@/types/networks'
import { Coins } from 'lucide-react'
import React, { useState } from 'react'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import { toast } from 'sonner'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import CustomInput from '../CustomInput'
import ConfirmPurchaseModal from './ConfirmPurchaseModal'
import { useEducation } from '@/providers/education/education-provider'

const EducationCard = () => {
    const [open, setOpen] = React.useState(false)
    
    const [proceed, setProceed] = React.useState(false)
    
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')
    const { educationAmount, profileCode, mobileNumber, currentProvider, isUTME, handleBuyEducation } = useEducation()

    const { data: profile, isPending: profilePending } = useGetProfile()
    
    const selected ={
      billersCode: profileCode,
      phone: mobileNumber,
      serviceID:currentProvider === "jamb" ? "jamb" : "waec",
      variation_code:currentProvider === "jamb" ? isUTME ? "utme" : "de" : "waecdirect",
      variation_amount:educationAmount,
      cashBack:"0.00"
    }

    const handleProceed = () => {
      if (!profileCode && currentProvider === "jamb") return toast.warning('Please enter a valid profile code, it can\'t be empty!')
        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit phone number')
        // if (!educationAmount) return toast.warning('Please enter Amount, it can\'t be empty!')
        // if (parseInt(educationAmount) < 500) return toast.warning('Amount cannot be Less than ₦500')
      setOpen(true)
    }

    if (profilePending) return <LoadingOverlay loader='2' />

  return (
    <Card className='rounded-xl space-y-6 border-none shadow-none max-md:space-y-2 md:min-h-[200px] md:p-5 p-2 dark:bg-card/70  '>
        <div className="p-4 flex flex-row gap-2 justify-center w-full rounded-sm border-none outline-none shadow-none">
       
        <div className=' flex flex-col gap-2 items-start w-full self-center '>
            <span className=' font-semibold'>Amount to pay</span>
            <div className=' flex border border-gray-300 w-full flex-row gap-1 p-4 rounded-md shadow-none max-md:p-4 text-lg '>
                <span className=' font-bold text-lg'>₦</span>
                <span className=' font-semibold'>{educationAmount}</span>
            </div>
        </div>

       </div>

          <Button
                className='w-full rounded-xl shadow-sm' 
                size={'lg'}
                
                onClick={handleProceed}
            >Continue</Button>



       {
            open && <ConfirmPurchaseModal
                open={open}
                paymentMethod={paymentMethod}
                setOpen={setOpen}
                selected={selected}
                setPaymentMethod={setPaymentMethod}
                setProceed={setProceed}
                key={'education'}
                title='Exam Type Purchase details...'
            />
        }




       {
            proceed && <DynamicModal
                open={proceed}
                setOpen={setProceed}
                dismissible
                dialogClassName={'sm:max-w-fit dark:bg-card'}
                drawerClassName='dark:bg-card'
            >
                <ConfirmPin 
                  className='rounded-none' 
                  func={() => {
                      handleBuyEducation?.({...selected!, method: paymentMethod})
                      setOpen(false)
                      setProceed(false)
                  }} 
                  profile={profile?.data!}
                />
            </DynamicModal>
        }

    </Card>
  )
}

export default EducationCard