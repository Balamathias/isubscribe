'use client'

import DynamicModal from '@/components/DynamicModal'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, SubAirtimeProps } from '@/types/networks'
import { airtel_airtime, etisalat_airtime, glo_airtime, mtn_airtime } from '@/utils/constants/airtime-plans'
import { product } from '@/utils/constants/product'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import ActivePaymentMethodButton from '../data/ActivePaymentMethodButton'
import { Button } from '@/components/ui/button'
import ConfirmPin from '../ConfirmPin'
import ConfirmPurchaseModal from './ConfirmPurchaseModal'

const object = {
    'mtn': mtn_airtime,
    'glo': glo_airtime,
    'airtel': airtel_airtime,
    '9mobile': etisalat_airtime
}

const AirtimeCards = () => {
    const { currentNetwork, handleSubAirtime, mobileNumber } = useNetwork()
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = useState<SubAirtimeProps | null>(null)
    const {data: wallet, isPending} = useGetWalletBalance()

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    if (isPending) return <LoadingOverlay />
  return (
    <div className='rounded-xl bg-white dark:bg-background md:p-5 p-2 grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4'>
        {object[currentNetwork]?.map((d, idx) => (
            <Card
                key={idx}
                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2"
                onClick={() => {
                    if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
                    if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')

                    setSelected(d)
                    setOpen(true)
                }}
            >
                <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                    <p className="font-semibold text-base">{formatNigerianNaira(priceToInteger(d?.Price!))}</p>
                    <p className='tracking-tighter'>Pay N{priceToInteger(d?.Price!)}</p>
                    <div className="flex flex-row items-center justify-center flex-wrap gap-1 text-violet-600 text-[9px] md:text-xs bg-violet-50 rounded-full px-2 p-1">
                        <span>{d?.CashBack}</span>
                        <span>Cashback</span>
                    </div>
                </div>
            </Card>
        ))}

{
            open && <ConfirmPurchaseModal 
                open={open}
                paymentMethod={paymentMethod}
                selected={selected!}
                setOpen={setOpen}
                setPaymentMethod={setPaymentMethod}
                setProceed={setProceed}
                key={'airtime'}
                title='Airtime Purchase details...'
            />
        }

        {
            proceed && <DynamicModal
                open={proceed}
                setOpen={setProceed}
                dismissible
                dialogClassName={'sm:max-w-fit'}
            >
                <ConfirmPin className='rounded-none' func={() => {
                    handleSubAirtime?.({...selected!, method: paymentMethod})
                    setOpen(false)
                    setProceed(false)
                }} />
            </DynamicModal>
        }
    </div>
  )
}

export default AirtimeCards