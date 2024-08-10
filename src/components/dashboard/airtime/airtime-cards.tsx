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
import { useGetProfile } from '@/lib/react-query/funcs/user'
import CustomInput from '../CustomInput'
import { Label } from '@/components/ui/label'

const object = {
    'mtn': mtn_airtime,
    'glo': glo_airtime,
    'airtel': airtel_airtime,
    '9mobile': etisalat_airtime
}

const AirtimeCards = () => {
    const { currentNetwork, handleSubAirtime, mobileNumber, openConfirmPurchaseModal, setOpenConfirmPurchaseModal  } = useNetwork()
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = useState<SubAirtimeProps | null>(null)
    const {data: wallet, isPending} = useGetWalletBalance()
    const { data: profile, isPending: profilePending } = useGetProfile()
    const [amount, setAmount] = useState<number | null>(null)

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    // if (isPending || profilePending) return <LoadingOverlay />
  return (
    <div className='flex flex-col gap-y-4'>
        <div className='rounded-xl bg-white dark:bg-card/80 md:p-5 p-2 grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4'>
            {object[currentNetwork]?.slice(0, 5)?.map((d, idx) => (
                <Card
                    key={idx}
                    className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all"
                    onClick={() => {
                        if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
                        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')

                        setSelected(d)
                        setOpenConfirmPurchaseModal?.(true)
                    }}
                >
                    <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                        <p className="font-semibold text-base">{formatNigerianNaira(priceToInteger(d?.Price!))}</p>
                        <p className='tracking-tighter'>Pay N{priceToInteger(d?.Price!)}</p>
                        <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                            <span>{d?.CashBack}</span>
                            <span>Cashback</span>
                        </div>
                    </div>
                </Card>
            ))}

            <ConfirmPurchaseModal 
                open={openConfirmPurchaseModal!}
                paymentMethod={paymentMethod}
                selected={selected!}
                setOpen={setOpenConfirmPurchaseModal}
                setPaymentMethod={setPaymentMethod}
                setProceed={setProceed}
                key={'airtime'}
                title='Airtime Purchase details...'
            />

            <DynamicModal
                open={proceed}
                setOpen={setProceed}
                dismissible
                dialogClassName={'sm:max-w-fit dark:bg-card'}
                drawerClassName='dark:bg-card'
                >
                <ConfirmPin 
                    className='rounded-none' 
                    func={() => {
                        handleSubAirtime?.({...selected!, method: paymentMethod})
                        // setOpen(false)
                        setProceed(false)
                    }} 
                    profile={profile?.data!}
                />
            </DynamicModal>
        </div>

        <div className='py-2 flex flex-col gap-y-1.5'>
            <Label htmlFor='amount' className='text-sm md:text-base font-semibold text-muted-foreground'>Enter Airtime Amount:</Label>
            <CustomInput 
                value={amount?.toString()}
                onChange={e => {
                    setAmount(() => parseInt(e.target.value))
                }}
                onBlur={() =>{}}
                name='Amount'
                placeholder='Enter Airtime Amount...'
                id='amount'
                type='number'
            />
            {amount ? <button 
                className='focus:outline-none border-none bg-green-700/15 text-green-600 py-2 px-3 rounded-lg hover:opacity-70 flex items-center justify-center mt-6 font-semibold'
                onClick={
                    () => {
                        setSelected({
                            CashBack:( amount! * 0.04).toString()  + '.00',
                            Plan_ID: 0,
                            plan_type: 'VTU',
                            Price: (amount!)?.toString()! + '.00'
                        })
                        setOpenConfirmPurchaseModal?.(true)
                    }
                }
            >
                {amount ? 'Pay ' + formatNigerianNaira(amount!) : 'Proceed'}
            </button> : <></>}
        </div>
    </div>
  )
}

export default AirtimeCards