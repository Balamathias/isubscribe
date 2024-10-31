"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PaymentMethod } from '@/types/networks'
import React from 'react'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import { toast } from 'sonner'
import ConfirmPurchaseModal from './ConfirmPurchaseModal'
import { useEducation } from '@/providers/education/education-provider'
import { Tables } from '@/types/database'
import PleaseSignIn from '../please-sign-in.modal'

const EducationCard = ({  profile }: { profile?: Tables<'profile'> | null }) => {
    
    const [proceed, setProceed] = React.useState(false)
    
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')
    const { educationAmount, profileCode, mobileNumber, currentProvider, isUTME, openConfirmPurchaseModal, setOpenConfirmPurchaseModal, handleBuyEducation } = useEducation()

    
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
       setOpenConfirmPurchaseModal?.(true)
    }

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

       {
        profile ? (
          <Button
                className='w-full rounded-xl shadow-sm' 
                size={'lg'}
                
                onClick={handleProceed}
            >Continue</Button>
        ): (
          <PleaseSignIn 
            trigger={<Button className='w-full rounded-xl shadow-sm' size={'lg'}>Continue</Button>}
            message='Please sign in to continue'
          />
        )
       }

       {
        <ConfirmPurchaseModal
            open={openConfirmPurchaseModal!}
            paymentMethod={paymentMethod}
            setOpen={setOpenConfirmPurchaseModal}
            selected={selected}
            setPaymentMethod={setPaymentMethod}
            setProceed={setProceed}
            key={'education'}
            title='Exam Type Purchase details...'
        />
        }




       {
        <DynamicModal
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
                // setOpen(false)
                setProceed(false)
            }} 
            profile={profile!}
          />
      </DynamicModal>
        }

    </Card>
  )
}

export default EducationCard