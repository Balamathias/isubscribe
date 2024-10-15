'use client'

import React from 'react'
import DynamicModal from '../../DynamicModal'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '../../ui/button'
import { product } from '@/utils/constants/product'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, VTPassDataPayload } from '@/types/networks'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import ConfirmProductInfo from './confirm-product-info'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'
import { useWallet } from '@/hooks/use-wallet'
import { toast } from 'sonner'
import Empty from '@/components/Empty'


interface ConfirmDataPurchaseModalProps {
    open: boolean,
    setOpen: any,
    title?: string,
    selected: VTPassDataPayload,
    paymentMethod: PaymentMethod,
    setPaymentMethod: (method: PaymentMethod) => void,
    setProceed: (proceed: boolean) => void
}

const ConfirmDataPurchaseModal = ({
    open,
    paymentMethod,
    selected,
    setOpen,
    setPaymentMethod,
    title,
    setProceed
}: ConfirmDataPurchaseModalProps) => {
    const { mobileNumber, currentNetwork, purchasing } = useNetwork()
    const { wallet, isLoading } = useWallet()

    if (isLoading) return <LoadingOverlay loader='1' />

    if (!wallet) {
        toast.error("Error loading wallet, please refresh.")
    }
    
  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dismissible
        dialogClassName="sm:max-w-[640px] md:max-w-[550px]"
    >
         
        <LoadingSpinner isPending={purchasing} />
        {
            !wallet ? (
                <Empty title='Error loading data' content={'An error occured while trying to load data, please try again'} className='bg-inherit'/>
            ): (
                <div className="flex flex-col gap-y-2.5 w-full">
            
                    <ConfirmProductInfo 
                            currentNetwork={currentNetwork}
                            mobileNumber={mobileNumber}
                            price={(selected?.amount || 0)}
                            dataQty={selected?.detail?.dataQty!}
                            dataDuration={selected?.detail?.duration!}
                            cashBack={selected?.cashback as number}
                            image={product[currentNetwork]?.image}
                    />

                        <div className='flex flex-col w-full gap-y-2.5'>
                            <ActivePaymentMethodButton 
                                active={paymentMethod === 'wallet'} 
                                handler={() => {setPaymentMethod('wallet')}} 
                                method='wallet'
                                balance={formatNigerianNaira(wallet?.balance! as number)}
                                disabled={wallet?.balance! < (selected?.amount || 0)}
                            />
                            <ActivePaymentMethodButton 
                                active={paymentMethod === 'cashback'} 
                                handler={() => {setPaymentMethod('cashback')}} 
                                method='cashback'
                                balance={formatNigerianNaira(wallet?.cashback_balance! as number)}
                                disabled={wallet?.cashback_balance! < (selected?.amount || 0)}
                            />
                        </div>

                        <Button 
                            className='w-full rounded-xl' 
                            size={'lg'}
                            disabled={(wallet?.balance! ) < (selected?.amount || 0) && (wallet?.cashback_balance! ) < (selected?.amount || 0)}
                            onClick={() => {
                                setProceed(true)
                            }}
                        >Proceed</Button>
                    </div>
            )
        }
    </DynamicModal>
  )
}

export default ConfirmDataPurchaseModal