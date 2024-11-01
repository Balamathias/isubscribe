'use client'

import React, { useCallback } from 'react'
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
    const { data: wallet, isPending: isLoading } = useGetWalletBalance()
    const { isEnabled, authenticate } = useBiometricAuth()
    
    const handleAuth = useCallback(async () => {
        try {
            if (!isEnabled) {
                setProceed(true)
                return
            }

            const isAuthenticated = await authenticate()
            if (isAuthenticated) {
                func?.()
            } else {
                setProceed(true)
            }
        } catch (error) {
            console.error('Authentication error:', error)
            setProceed(true)
            toast.error('Biometric authentication failed, please use your PIN')
        }
    }, [isEnabled, authenticate, setProceed, func])

    const handlePurchase = useCallback(() => {
        const insufficientFunds = 
            paymentMethod === 'wallet' 
                ? wallet?.data?.balance! < selected?.amount
                : wallet?.data?.cashback_balance! < selected?.amount

        if (insufficientFunds) {
            toast.error('Insufficient funds for this transaction')
            return
        }

        handleAuth()
    }, [paymentMethod, wallet?.data, selected?.amount, handleAuth])

    if (isLoading) return <LoadingOverlay />

    if (!wallet?.data || !wallet?.data?.balance) {
        return toast.error("Error loading wallet, please refresh.")
    }
    
    return (
        <DynamicModal
            open={open}
            setOpen={setOpen}
            dismissible
            dialogClassName="sm:max-w-[640px] md:max-w-[550px]"
        >
            <LoadingSpinner isPending={purchasing} />
            <div className="flex flex-col gap-y-2.5">
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
                        handler={() => setPaymentMethod('wallet')} 
                        method='wallet'
                        balance={formatNigerianNaira(wallet?.data?.balance as number)}
                        disabled={wallet?.data?.balance! < selected?.amount}
                    />
                    <ActivePaymentMethodButton 
                        active={paymentMethod === 'cashback'} 
                        handler={() => setPaymentMethod('cashback')} 
                        method='cashback'
                        balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number)}
                        disabled={wallet?.data?.cashback_balance! < selected?.amount}
                    />
                </div>

                <Button 
                    className='w-full rounded-xl' 
                    size={'lg'}
                    disabled={
                        wallet?.data?.balance! < selected?.amount && 
                        wallet?.data?.cashback_balance! < selected?.amount
                    }
                    onClick={handlePurchase}
                >
                    Proceed
                </Button>
            </div>
        </DynamicModal>
    )
}

export default ConfirmPurchaseModal