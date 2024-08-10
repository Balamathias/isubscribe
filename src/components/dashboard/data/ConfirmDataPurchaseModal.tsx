'use client'

import React from 'react'
import DynamicModal from '../../DynamicModal'
import Image from 'next/image'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { parseWithInterestPrice, priceToInteger } from '@/funcs/priceToNumber'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '../../ui/button'
import { product } from '@/utils/constants/product'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, SubAirtimeProps, SubDataProps, VTPassDataPayload } from '@/types/networks'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import ConfirmProductInfo from './confirm-product-info'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'


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
    const { data: wallet, isPending } = useGetWalletBalance()

    if (isPending) return <LoadingOverlay />
  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dismissible
        dialogClassName="sm:max-w-[640px] md:max-w-[550px]"
    >
         
        <LoadingSpinner isPending={purchasing} />
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
                    balance={formatNigerianNaira(wallet?.data?.balance! as number)}
                    disabled={wallet?.data?.balance! < (selected?.amount || 0)}
                />
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'cashback'} 
                    handler={() => {setPaymentMethod('cashback')}} 
                    method='cashback'
                    balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number)}
                    disabled={wallet?.data?.cashback_balance! < (selected?.amount || 0)}
                />
            </div>

            <Button 
                className='w-full rounded-xl' 
                size={'lg'}
                disabled={(wallet?.data?.balance! ) < (selected?.amount || 0) && (wallet?.data?.cashback_balance! ) < (selected?.amount || 0)}
                onClick={() => {
                    setProceed(true)
                }}
            >Proceed</Button>
        </div>
    </DynamicModal>
  )
}

export default ConfirmDataPurchaseModal