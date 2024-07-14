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
    const { mobileNumber, currentNetwork } = useNetwork()
    const { data: wallet, isPending } = useGetWalletBalance()

    if (isPending) return <LoadingOverlay />
  return (
    <DynamicModal
        open={open}
        setOpen={setOpen}
        dismissible
        dialogClassName="sm:max-w-[640px]"
    >
        <div className="flex flex-col gap-y-2.5 w-full">
            <h1 className="md:text-lg text-base md:text-start text-center font-semibold text-violet-700">Data Plan Details</h1>
            
            <div className='flex flex-col gap-y-2 p-3 rounded-lg bg-violet-100 text-xs md:text-sm'>
                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Product</p>
                    <p className='flex items-center flex-row gap-x-1'>{product[currentNetwork].name} | 

                        <Image
                            src={product[currentNetwork].image}
                            width={20}
                            height={20}
                            quality={100}
                            alt={currentNetwork}
                            className='h-7 w-7 rounded-full object-cover' 
                        />
                    </p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Phone Number</p>
                    <p>{mobileNumber}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Price</p>
                    <p>{formatNigerianNaira(selected?.amount!)}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Amount</p>
                    <p>{selected?.detail?.dataQty}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Duration</p>
                    <p>{selected?.detail?.duration}</p>
                </div>

                <div className='flex flex-row justify-between items-center gap-x-2'>
                    <p className='font-semibold text-muted-foreground'>Cashback</p>
                    <p className='px-2 py-1 rounded-full bg-violet-200 text-violet-800'>+{selected?.cashback}</p>
                </div>
            </div>

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
                disabled={wallet?.data?.balance! < (selected?.amount || 0)}
                onClick={() => {
                    setProceed(true)
                }}
            >Proceed</Button>
        </div>
    </DynamicModal>
  )
}

export default ConfirmDataPurchaseModal