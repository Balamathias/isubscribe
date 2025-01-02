'use client'

import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, VTPassDataPayload } from '@/types/networks'
import { VTPassServiceIds } from '@/utils/networks'
import React, { lazy, Suspense, useState } from 'react'
import { toast } from 'sonner'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import PlaceHolder from '@/components/place-holder-component'
import NetworkCardItem from './NetworkCardItem'
import { useServices } from '@/lib/react-query/funcs/data'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { useSearchParams } from 'next/navigation'
import NetworkCardSkeleton from '@/components/loaders/network-card.skeleton'

const ConfirmDataPurchaseModal = lazy(() => import('./ConfirmDataPurchaseModal'))
    
const DailyData = ({type="daily"}: { type?: ('daily' | 'weekly' | 'monthly' | 'night' | 'mega' | 'youtube' | 'special' | 'weekend')}) => {

    const services = useServices()

  const { currentNetwork, mobileNumber, handleVTPassData, openConfirmPurchaseModal, setOpenConfirmPurchaseModal } = useNetwork()

    const [selected, setSelected] = useState<VTPassDataPayload | null>(null)
    const { data: profile, isPending: profilePending } = useGetProfile()
    const searchParams = useSearchParams()
    const isClaim = searchParams.get('action') === 'claim' 

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    if (profilePending || services.isLoading) return (
        <NetworkCardSkeleton />
    )

    if (!services[currentNetwork] || !services[currentNetwork]?.length) {
        return (
            <PlaceHolder 
                title={`No ${type} data plans available for ${currentNetwork} network`}
                description='There are no data plans available for this network'
            />
        )
    }

  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {services[currentNetwork]?.map((d, idx) => (
            <NetworkCardItem 
                key={idx}
                dataCashBack={d.unitCashback ?? 0}
                dataQty={d.dataQty}
                dataDuration={d.duration}
                dataPrice={d.unitPrice}
                profile={profile?.data}
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
                            interest: d?.interest,
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

           {openConfirmPurchaseModal && selected && (
                <Suspense fallback={<LoadingOverlay loader='1' />}>
                    <ConfirmDataPurchaseModal 
                        open={openConfirmPurchaseModal}
                        paymentMethod={paymentMethod}
                        selected={selected}
                        setOpen={setOpenConfirmPurchaseModal!}
                        setPaymentMethod={setPaymentMethod}
                        setProceed={setProceed}
                        title='Data Purchase Details (Confirm Details)'
                        func={() => {
                            handleVTPassData(paymentMethod, selected!)
                            setProceed(false)
                        }}
                        isDailyData
                    />
                </Suspense>
            )}

        <DynamicModal
            open={proceed}
            setOpen={setProceed}
            dismissible
            dialogClassName={'sm:max-w-fit dark:bg-card !p-0'}
            drawerClassName='dark:bg-card'
            hideDrawerCancel
        >
            {/* <ConfirmPin 
                className='rounded-none' 
                func={() => {
                    handleVTPassData(paymentMethod, selected!)
                    setProceed(false)
                }} 
                profile={profile?.data!}
            /> */}
            <div className='p-4'>
                <h2 className='text-xl font-semibold'>Coming soon!</h2>
                <p className='text-muted-foreground'>We are bringing Regular plans to you soonest, in the meantime, stay tuned.</p>
            </div>
        </DynamicModal>
    </div>
  )
}

export default DailyData
