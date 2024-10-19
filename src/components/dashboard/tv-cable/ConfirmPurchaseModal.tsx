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
    selected: SubTvPayload,
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
    const { mobileNumber, currentProvider, smartcardNumber, purchasing } = useTvCable()
    const { data: wallet, isPending } = useGetWalletBalance()

    // console.log("bb", wallet?.data?.balance)
    // console.log("bc", wallet?.data?.cashback_balance)
    // console.log("sa",  priceToInteger(selected?.variation_amount))
    // console.log("sc", priceToInteger(selected?.cashBack!))

    if (isPending) return <LoadingOverlay />
  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dismissible
        dialogClassName="sm:max-w-[640px] md:max-w-[550px] "
    >  
       
        <LoadingSpinner isPending={purchasing} />
        <div className="flex flex-col gap-y-2.5">
            <h1 className="md:text-lg text-base md:text-start text-center font-semibold text-violet-700">{title ? title : 'Airtime Plan Details'}</h1>
            
            <div className='flex flex-col gap-y-2 p-3 rounded-lg bg-violet-100 dark:bg-secondary text-xs md:text-sm'>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Product</p>
                    <p className='flex items-center flex-row gap-x-1'>{tvProducts[currentProvider].name} | 

                        <Image
                            src={tvProducts[currentProvider].image}
                            width={20}
                            height={20}
                            quality={100}
                            alt={currentProvider}
                            className='h-7 w-7 rounded-full object-cover' 
                        />
                    </p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Name</p>
                    <p>{selected?.name }</p>
                </div>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Decoder Number</p>
                    <p>{smartcardNumber}</p>
                </div>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Phone Number</p>
                    <p>{mobileNumber}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Price</p>
                    <p>{formatNigerianNaira(selected?.variation_amount as any)}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Amount</p>
                    <p>{formatNigerianNaira(priceToInteger(selected?.variation_amount))}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Cashback</p>
                    <p className='px-2 py-1 rounded-full bg-violet-200 text-violet-800'>+{selected?.cashBack}</p>
                </div>
            </div>

            <div className='flex flex-col w-full gap-y-2.5'>
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'wallet'} 
                    handler={() => {setPaymentMethod('wallet')}} 
                    method='wallet'
                    balance={formatNigerianNaira(wallet?.data?.balance! as number)}
                    disabled={wallet?.data?.balance! < priceToInteger(selected?.variation_amount || '0.00')  }
                />
                <ActivePaymentMethodButton 
                    active={paymentMethod === 'cashback'} 
                    handler={() => {setPaymentMethod('cashback')}} 
                    method='cashback'
                    balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number)}
                    disabled={wallet?.data?.cashback_balance! < priceToInteger(selected?.variation_amount || '0.00') }
                />
            </div>
            
            <ComingSoon 
                trigger={
                    <Button 
                        className='w-full rounded-xl' 
                        size={'lg'}
                        disabled={wallet?.data?.balance! < priceToInteger(selected?.variation_amount || '0.00') }
                        // onClick={() => {
                        //     setProceed(true)
                        // }}
                    >Proceed</Button>
                }
            />
        </div>
    </DynamicModal>
  )
}

export default ConfirmPurchaseModal