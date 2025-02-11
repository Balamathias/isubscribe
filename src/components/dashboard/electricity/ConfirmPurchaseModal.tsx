import React from 'react'
import DynamicModal from '../../DynamicModal'
import Image from 'next/image'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { priceToInteger } from '@/funcs/priceToNumber'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '../../ui/button'
import { PaymentMethod, SubAirtimeProps, SubDataProps } from '@/types/networks'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import LoadingOverlay from '../../loaders/LoadingOverlay'
import { useTvCable } from '@/providers/tv-cable/tv-cable-provider'
import { SubTvPayload } from '@/types/tv-cable'
import { useElectricity } from '@/providers/electricity/electricity-provider'
import { electricServices } from '@/utils/constants/electricity-plans'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'
import ComingSoon from '../comig-soon'
import { useRouter } from 'nextjs-toploader/app'

export const tvProducts = {
    'dstv': {
        name: 'DSTV',
        image: '/images/tv-cables/ds-tv-logo.jpg'
    },
    'gotv': {
        name: 'GOTV',
        image: '/images/tv-cables/go-tv-logo.png'
    },
    'startimes': {
        name: 'Startimes',
        image: '/images/tv-cables/star-times-logo.png'
    },
    'showmax': {
        name: 'Showmax',
        image: '/images/tv-cables/show-max-logo.png'
    }
}



interface ConfirmPurchaseModal {
    open: boolean,
    setOpen: any,
    title?: string,
    selected?: SubTvPayload,
    paymentMethod: PaymentMethod,
    setPaymentMethod: (method: PaymentMethod) => void,
    setProceed: (proceed: boolean) => void,
    fee: number,
    totalAmount: number
}

const ConfirmPurchaseModal = ({
    open,
    paymentMethod,
    selected,
    setOpen,
    setPaymentMethod,
    title,
    setProceed,
}: ConfirmPurchaseModal) => {
    const { mobileNumber, currentProvider, smartcardNumber, meterNumber, isPrepaid, providerImage, providerName, purchasing, wallet, fee, totalAmount } = useElectricity()
    
    const router = useRouter()

    const insufficientFunds = wallet?.balance! < totalAmount

    const handleProceed = () => {
        if (insufficientFunds) {
            router.push('/dashboard/fund-wallet')
        } else {
            setProceed(true)
        }
    }
    
  return (
    <DynamicModal
        open={open}
        setOpen={purchasing ? undefined : setOpen}
        dialogClassName="sm:max-w-[640px] md:max-w-[550px] "
        drawerClassName=''
        title={`${providerName}-plan details`}
    >
         
        <LoadingSpinner isPending={purchasing} />
        <div className="flex flex-col gap-y-2.5">            
            <div className='flex flex-col gap-y-2 p-3 rounded-lg bg-violet-100 dark:bg-inherit text-xs md:text-sm'>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Product</p>
                    <p className='flex items-center flex-row gap-x-1'>{providerName}

                        <Image
                            src={providerImage}
                            width={20}
                            height={20}
                            quality={100}
                            alt={currentProvider}
                            className='h-7 w-7 rounded-full object-cover' 
                        />
                    </p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Meter Number</p>
                    <p>{meterNumber}</p>
                </div>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Meter Type</p>
                    <p>{isPrepaid ? "Prepaid" : "Postpaid"}</p>
                </div>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Phone Number</p>
                    <p>{mobileNumber || "Nill"}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Fee</p>
                    <p>{formatNigerianNaira(fee)}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Power Amount</p>
                    <p>{formatNigerianNaira(selected?.variation_amount as any)}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Amount to pay</p>
                    <p className='text-amber-500'>{formatNigerianNaira(totalAmount)}</p>
                </div>
            </div>

            <div className='flex flex-col w-full gap-y-2.5'>
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'wallet'} 
                    handler={() => {setPaymentMethod('wallet')}} 
                    method='wallet'
                    balance={formatNigerianNaira(wallet?.balance! as number ?? 0)}
                    disabled={wallet?.balance! < totalAmount  }
                />
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'cashback'} 
                    handler={() => {setPaymentMethod('cashback')}} 
                    method='cashback'
                    balance={formatNigerianNaira(wallet?.cashback_balance! as number ?? 0)}
                    disabled={wallet?.cashback_balance! < totalAmount }
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