"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useElectricity } from '@/providers/electricity/electricity-provider'
import { PaymentMethod } from '@/types/networks'
import { Coins } from 'lucide-react'
import React, { useState } from 'react'
import ConfirmPurchaseModal from './ConfirmPurchaseModal'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import { toast } from 'sonner'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import CustomInput from '../CustomInput'

const ElectricityCards = () => {
    const [open, setOpen] = React.useState(false)
    
    const [proceed, setProceed] = React.useState(false)
    
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')
    const { powerAmount, meterNumber, mobileNumber, currentProvider, isPrepaid, setPowerAmount, handleBuyElectricity } = useElectricity()

    const { data: profile, isPending: profilePending } = useGetProfile()
    
    const selected ={
      billersCode: meterNumber,
      phone: mobileNumber,
      serviceID:currentProvider,
      variation_code:isPrepaid ? "prepaid" : "postpaid",
      variation_amount:powerAmount,
      cashBack:"0.00"
    }

    const handleProceed = () => {
      if (!meterNumber) return toast.warning('Please enter a valid meter number, it can\'t be empty!')
        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit phone number')
        if (!powerAmount) return toast.warning('Please enter Amount, it can\'t be empty!')
        if (parseInt(powerAmount) < 500) return toast.warning('Amount cannot be Less than ₦500')
      setOpen(true)
    }

    if (profilePending) return <LoadingOverlay loader='2' />

  return (
    <Card className='rounded-xl space-y-6 border-none shadow-none max-md:space-y-2 md:min-h-[200px] md:p-5 p-2 dark:bg-card/70  '>
        <div className="p-4 flex flex-row gap-2 justify-center w-full rounded-sm border-none outline-none shadow-none">
        {/* <span className="text-green-600 rounded-full bg-green-200 p-1 md:p-2">
          <Coins />
        </span> */}
        <CustomInput
          onChange={(e) => setPowerAmount(e.target.value)}
          type="number"
          // required
          // aria-required
          value={powerAmount}
          placeholder="₦ Enter Amount here..."
          className=' p-8 rounded-md shadow-none max-md:p-6 text-lg md:w-1/2 self-center text-center'
        />
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
                key={'electricity'}
                title='Electricity Purchase details...'
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
                      handleBuyElectricity?.({...selected!, method: paymentMethod})
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

export default ElectricityCards