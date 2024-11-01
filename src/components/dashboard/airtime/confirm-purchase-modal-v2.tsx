'use client'

import React from 'react'
import DynamicModal from '../../DynamicModal'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '../../ui/button'
import { product } from '@/utils/constants/product'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, VTPassAirtimePayload } from '@/types/networks'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import ConfirmProductInfo from '../data/confirm-product-info'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'
import { useWallet } from '@/hooks/use-wallet'

import useBiometricAuth from '@/hooks/use-biometric-auth'
import { toast } from 'sonner'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'


interface ConfirmPurchaseModal {
    open: boolean,
    setOpen: () => void,
    title?: string,
    selected: VTPassAirtimePayload,
    paymentMethod: PaymentMethod,
    setPaymentMethod: (method: PaymentMethod) => void,
    setProceed: (proceed: boolean) => void,
    func?: () => void,
}

const ConfirmPurchaseModal = ({
    open,
    paymentMethod,
    selected,
    setOpen,
    setPaymentMethod,
    title,
    setProceed,
    func
}: ConfirmPurchaseModal) => {
    const { mobileNumber, currentNetwork, purchasing } = useNetwork()
    const { data:wallet, isPending: isLoading } = useGetWalletBalance()

    const { isEnabled, authenticate, error } = useBiometricAuth()
    
    const handleAuth = async () => {
        if (isEnabled) {
            const isAuthenticated = await authenticate()
            if (isAuthenticated) func?.()
            } else {
        setProceed(true)
        }
    }
    

    if (isLoading) return <LoadingOverlay />

    if (!wallet?.data || !wallet?.data?.balance) {
        toast.error("Error loading wallet, please refresh.")
    }
    
  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dismissible
        dialogClassName="sm:max-w-[640px] md:max-w-[550px] "
    >
        
        <LoadingSpinner isPending={purchasing} />
        <div className="flex flex-col gap-y-2.5">
            {/* <h1 className="md:text-lg text-base md:text-start text-center font-semibold text-violet-700">{title ? title : 'Airtime Plan Details'}</h1> */}
            
            <ConfirmProductInfo 
                image={product[currentNetwork]?.image}
                title={title}
                price={selected?.amount || 0}
                currentNetwork={currentNetwork}
                mobileNumber={mobileNumber}
                cashBack={(selected?.cashback || 0)}
                dataDuration={'30 days'}
                dataQty={selected?.amount?.toFixed(2)}
            />

            <div className='flex flex-col w-full gap-y-2.5'>
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'wallet'} 
                    handler={() => {setPaymentMethod('wallet')}} 
                    method='wallet'
                    balance={formatNigerianNaira(wallet?.data?.balance as number)}
                    disabled={wallet?.data?.balance! < selected?.amount}
                />
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'cashback'} 
                    handler={() => {setPaymentMethod('cashback')}} 
                    method='cashback'
                    balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number)}
                    disabled={wallet?.data?.cashback_balance! < (selected?.amount)}
                />
            </div>

            <Button 
                className='w-full rounded-xl' 
                size={'lg'}
                disabled={wallet?.data?.balance! < selected?.amount && (wallet?.data?.cashback_balance! ) < selected?.amount}
                onClick={() => {
                    isEnabled && !error ? handleAuth() : setProceed(true)
                }}
            >Proceed</Button>
        </div>
    </DynamicModal>
  )
}

export default ConfirmPurchaseModal