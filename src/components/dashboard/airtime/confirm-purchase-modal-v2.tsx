'use client'

import React, { useCallback } from 'react'
import DynamicModal from '../../DynamicModal'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '../../ui/button'
import { product } from '@/utils/constants/product'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, VTPassAirtimePayload } from '@/types/networks'
import ConfirmProductInfo from '../data/confirm-product-info'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'

import useBiometricAuth from '@/hooks/use-biometric-auth'
import { toast } from 'sonner'
import Empty from '@/components/Empty'
import { useRouter } from 'nextjs-toploader/app'


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
    const { mobileNumber, currentNetwork, purchasing, wallet } = useNetwork()
    const { isEnabled, authenticate, error } = useBiometricAuth()

    const router = useRouter()

    const insufficientFunds = wallet?.balance! < selected?.amount && 
    wallet?.cashback_balance! < selected?.amount
    
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
                ? wallet?.balance! < selected?.amount
                : wallet?.cashback_balance! < selected?.amount

        if (insufficientFunds) {
            toast.error('Insufficient funds for this transaction')
            return
        }

        if (!mobileNumber || mobileNumber?.length < 10) {
            toast.warning("Please enter a valid phone number")
            return
        }

        handleAuth()
    }, [paymentMethod, wallet, selected?.amount, handleAuth])

    const handleProceed = () => {
        if (insufficientFunds) {
            router.push('/dashboard/fund-wallet')
        } else {
            handlePurchase()
        }
    }

    if (!wallet) {
        return (
            <Empty 
                title='Error loading data' 
                content='An error occurred while trying to load data, please try again' 
                className='bg-inherit'
            />
        )
    }
    
    return (
        <DynamicModal
            open={open}
            setOpen={purchasing ? undefined : () => setOpen()}
            dialogClassName="sm:max-w-[640px] md:max-w-[550px]"
            title="Confirm product details"
            dismissible={false}
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
                        balance={formatNigerianNaira(wallet?.balance as number)}
                        disabled={wallet?.balance! < selected?.amount}
                    />
                    <ActivePaymentMethodButton 
                        active={paymentMethod === 'cashback'} 
                        handler={() => setPaymentMethod('cashback')} 
                        method='cashback'
                        balance={formatNigerianNaira(wallet?.cashback_balance! as number)}
                        disabled={wallet?.cashback_balance! < selected?.amount}
                    />
                </div>
                <Button 
                    className='w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white' 
                    size={'lg'}
                    onClick={handleProceed}
                >
                    {insufficientFunds ? 'Fund Wallet' : 'Proceed'}
                </Button>
            </div>
        </DynamicModal>
    )
}

export default ConfirmPurchaseModal