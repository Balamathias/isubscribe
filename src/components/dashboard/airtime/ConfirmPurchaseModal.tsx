'use client'

import React from 'react'
import DynamicModal from '../../DynamicModal'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { priceToInteger } from '@/funcs/priceToNumber'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '../../ui/button'
import { product } from '@/utils/constants/product'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, SubAirtimeProps, SubDataProps } from '@/types/networks'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import ConfirmProductInfo from '../data/confirm-product-info'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'


interface ConfirmPurchaseModal {
    open: boolean,
    setOpen: any,
    title?: string,
    selected: SubDataProps | SubAirtimeProps,
    paymentMethod: PaymentMethod,
    setPaymentMethod: (method: PaymentMethod) => void,
    setProceed: (proceed: boolean) => void
}

const ConfirmPurchaseModal = ({
    open,
    paymentMethod,
    selected,
    setOpen,
    setPaymentMethod,
    title,
    setProceed
}: ConfirmPurchaseModal) => {
    const { mobileNumber, currentNetwork, purchasing } = useNetwork()
    const { data: wallet, isPending } = useGetWalletBalance()

    if (isPending) return <LoadingOverlay />
  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dismissible={false}
        dialogClassName="sm:max-w-[640px] md:max-w-[550px] "
    >
        
        <LoadingSpinner isPending={purchasing} />
        <div className="flex flex-col gap-y-2.5">
            {/* <h1 className="md:text-lg text-base md:text-start text-center font-semibold text-violet-700">{title ? title : 'Airtime Plan Details'}</h1> */}
            
            <ConfirmProductInfo 
                image={product[currentNetwork]?.image}
                title={title}
                price={priceToInteger(selected?.Price)}
                currentNetwork={currentNetwork}
                mobileNumber={mobileNumber}
                cashBack={priceToInteger(selected?.CashBack!)}
                dataDuration={'30 days'}
                dataQty={selected?.Price!}
            />

            <div className='flex flex-col w-full gap-y-2.5'>
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'wallet'} 
                    handler={() => {setPaymentMethod('wallet')}} 
                    method='wallet'
                    balance={formatNigerianNaira(wallet?.data?.balance! as number)}
                    disabled={wallet?.data?.balance! < priceToInteger(selected?.Price || '0.00')}
                />
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'cashback'} 
                    handler={() => {setPaymentMethod('cashback')}} 
                    method='cashback'
                    balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number)}
                    disabled={wallet?.data?.cashback_balance! < priceToInteger(selected?.Price || '0.00')}
                />
            </div>

            <Button 
                className='w-full rounded-xl' 
                size={'lg'}
                disabled={wallet?.data?.balance! < priceToInteger(selected?.Price || '0.00') && (wallet?.data?.cashback_balance! ) <  priceToInteger(selected?.Price || '0.00')}
                onClick={() => {
                    setProceed(true)
                }}
            >Proceed</Button>
        </div>
    </DynamicModal>
  )
}

export default ConfirmPurchaseModal