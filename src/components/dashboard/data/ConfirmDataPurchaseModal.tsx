'use client'

import React, { useCallback } from 'react'
import DynamicModal from '../../DynamicModal'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import ActivePaymentMethodButton from './ActivePaymentMethodButton'
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
import { useSearchParams } from 'next/navigation'
import useBiometricAuth from '@/hooks/use-biometric-auth'
import { useInsertBeneficiary } from '@/lib/react-query/funcs/beneficiaries'
import { useRouter } from 'nextjs-toploader/app'

interface ConfirmDataPurchaseModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    title?: string
    selected: VTPassDataPayload
    paymentMethod: PaymentMethod
    setPaymentMethod: (method: PaymentMethod) => void
    setProceed: (proceed: boolean) => void
    isDailyData?: boolean
    func?: () => void
}

const ConfirmDataPurchaseModal = ({
    open,
    paymentMethod,
    selected,
    setOpen,
    setPaymentMethod,
    title,
    setProceed,
    isDailyData,
    func
}: ConfirmDataPurchaseModalProps) => {
    const { mobileNumber, currentNetwork, purchasing, wallet } = useNetwork()
    const searchParams = useSearchParams()
    const isClaim = searchParams.get('action') === 'claim'
    const { isEnabled, authenticate, error } = useBiometricAuth()
    const { mutate: saveBeneficiary } = useInsertBeneficiary()

    const router = useRouter()

    const insufficientFunds = paymentMethod === 'wallet' ? wallet?.balance! < (selected?.amount || 0) : 
    wallet?.cashback_balance! < (selected?.amount || 0)

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
                ? wallet?.balance! < (selected?.amount || 0)
                : wallet?.cashback_balance! < (selected?.amount || 0)

        if (insufficientFunds) {
            toast.error('Insufficient funds for this transaction')
            return
        }

        handleAuth()
    }, [paymentMethod, wallet, selected?.amount, handleAuth])

    const handleProceed = () => {
        if (insufficientFunds) {
            router.push('/dashboard/fund-wallet')
        } else {
            if (isEnabled && !error) {
                handleAuth()
            } else {
                setProceed(true)
            }
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
            setOpen={purchasing ? undefined : setOpen}
            title={selected?.planName ? (<h2 className='max-md:-ml-10 line-clamp-1 text-sm md:text-base text-center'>{selected?.planName}</h2>) : "Plan Information"}
            dismissible={false}
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
                    planName={selected?.planName}
                />

                <div className='flex flex-col w-full gap-y-2.5'>
                    <ActivePaymentMethodButton 
                        active={paymentMethod === 'wallet'} 
                        handler={() => setPaymentMethod('wallet')} 
                        method='wallet'
                        balance={formatNigerianNaira(wallet?.balance! as number)}
                        disabled={wallet?.balance! < (selected?.amount || 0)}
                    />
                    {!isDailyData && !isClaim && (
                        <ActivePaymentMethodButton 
                            active={paymentMethod === 'cashback'} 
                            handler={() => setPaymentMethod('cashback')} 
                            method='cashback'
                            balance={formatNigerianNaira(wallet?.cashback_balance! as number)}
                            disabled={wallet?.cashback_balance! < (selected?.amount || 0)}
                        />
                    )}
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

export default ConfirmDataPurchaseModal