'use client'

import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { airtelData, etisalatData, gloData, mtnData } from '@/utils/constants/vtp/data-plans'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, SubDataProps, VTPassDataPayload } from '@/types/networks'
import { VTPassServiceIds } from '@/utils/networks'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import ConfirmDataPurchaseModal from './ConfirmDataPurchaseModal'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import PlaceHolder from '@/components/place-holder-component'
import NetworkCardItem from './NetworkCardItem'
import { useServices } from '@/lib/react-query/funcs/data'
    
const DailyData = ({type="daily"}: { type?: ('daily' | 'weekly' | 'monthly' | 'night' | 'mega' | 'youtube' | 'special' | 'weekend')}) => {

    const services = useServices()
        
    const object = useMemo(() => {
        return {
            'mtn': mtnData?.[type],
            'glo': gloData?.[type],
            'airtel': airtelData?.[type],
            '9mobile': etisalatData?.[type]
        }
    }, [type])

  const { currentNetwork, mobileNumber, handleVTPassData, openConfirmPurchaseModal, setOpenConfirmPurchaseModal } = useNetwork()

    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = useState<VTPassDataPayload | null>(null)
    const {data: wallet, isPending} = useGetWalletBalance()
    const { data: profile, isPending: profilePending } = useGetProfile()

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    if (isPending || profilePending || services.isLoading) return <LoadingOverlay />

    console.log(services);

    if (!object[currentNetwork] || !object[currentNetwork]?.length) {
        return (
            <PlaceHolder 
                title={`No ${type} data plans available for ${currentNetwork} network`}
                description='There are no data plans available for this network'
            />
        )
    }

  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {object[currentNetwork]?.map((d, idx) => (
            <NetworkCardItem 
                key={idx}
                dataCashBack={d.unitCashback ?? 0}
                dataQty={d.dataQty}
                dataDuration={d.duration}
                dataPrice={d.unitPrice}
                handler={
                    () => {
                        if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
                        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')
    
                        setSelected({
                            phone: mobileNumber,
                            serviceID: VTPassServiceIds[currentNetwork],
                            variation_code: d.planId,
                            amount: d.unitPrice,
                            cashback: d.unitCashback,
                            detail: {
                                dataAmount: d.unitPrice,
                                dataQty: d.dataQty,
                                duration: d.duration,
                                network: d.network
                            }
                        })
                        setOpenConfirmPurchaseModal?.(true)
                    }
                }
            />
        ))}

        <ConfirmDataPurchaseModal 
            open={openConfirmPurchaseModal!}
            paymentMethod={paymentMethod}
            selected={selected!}
            setOpen={setOpenConfirmPurchaseModal}
            setPaymentMethod={setPaymentMethod}
            setProceed={setProceed}
            title='Data Purchase Details (Confirm Details)'
        />

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
                    handleVTPassData(paymentMethod, selected!)
                    // setOpen(false)
                    setProceed(false)
                }} 
                profile={profile?.data!}
            />
        </DynamicModal>
    </div>
  )
}

export default DailyData

// https://gb0wpg0l-3000.euw.devtunnels.ms/