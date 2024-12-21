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
    const { mobileNumber, currentProvider, smartcardNumber, meterNumber, isPrepaid, providerImage, providerName, purchasing } = useElectricity()
    
    const { data: wallet, isPending } = useGetWalletBalance()
    
    if (isPending) return <LoadingOverlay />

  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dialogClassName="sm:max-w-[640px] md:max-w-[550px] "
        drawerClassName=''
        title="Electricity Plan Details"
    >
         
        <LoadingSpinner isPending={purchasing} />
        <div className="flex flex-col gap-y-2.5">            
            <div className='flex flex-col gap-y-2 p-3 rounded-lg bg-violet-100 dark:bg-secondary text-xs md:text-sm'>
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
                    <p className='font-semibold text-muted-foreground'>Amount to pay</p>
                    <p>{formatNigerianNaira(selected?.variation_amount as any)}</p>
                </div>

               

                {/* <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Cashback</p>
                    <p className='px-2 py-1 rounded-full bg-violet-200 text-violet-800'>+{selected?.cashBack}</p>
                </div> */}
            </div>

            <div className='flex flex-col w-full gap-y-2.5'>
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'wallet'} 
                    handler={() => {setPaymentMethod('wallet')}} 
                    method='wallet'
                    balance={formatNigerianNaira(wallet?.data?.balance! as number ?? 0)}
                    disabled={wallet?.data?.balance! < parseInt(selected?.variation_amount || '0.00')  }
                />
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'cashback'} 
                    handler={() => {setPaymentMethod('cashback')}} 
                    method='cashback'
                    balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number ?? 0)}
                    disabled={wallet?.data?.cashback_balance! < parseInt(selected?.variation_amount || '0.00') }
                />
            </div>
{/*             
            <ComingSoon 
                trigger={ */}
                    <Button 
                        className='w-full rounded-xl' 
                        size={'lg'}
                        disabled={wallet?.data?.balance! < parseInt(selected?.variation_amount || '0.00') }
                        onClick={() => {
                            setProceed(true)
                        }}
                    >Proceed</Button>
                   {/* }
              /> */}
        </div>
    </DynamicModal>
  )
}

export default ConfirmPurchaseModal