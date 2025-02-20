'use client'

import DynamicModal from '@/components/DynamicModal'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, SubAirtimeProps } from '@/types/networks'
import { airtel_airtime, etisalat_airtime, glo_airtime, mtn_airtime } from '@/utils/constants/airtime-plans'
import React, { lazy, Suspense, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ConfirmPin from '../ConfirmPin'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import CustomInput from '../CustomInput'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const ConfirmPurchaseModal = lazy(() => import('./ConfirmPurchaseModal'))

const object = {
    'mtn': mtn_airtime,
    'glo': glo_airtime,
    'airtel': airtel_airtime,
    '9mobile': etisalat_airtime
}

const MAX_THRESHHOLD = 500_000
const MIN_THRESHHOLD = 50

const AirtimeCards = () => {
    const { currentNetwork, handleSubAirtime, mobileNumber, openConfirmPurchaseModal, setOpenConfirmPurchaseModal  } = useNetwork()
    const [selected, setSelected] = useState<SubAirtimeProps | null>(null)
    const { data: profile, isPending: _profilePending } = useGetProfile()
    const [amount, setAmount] = useState<number | null>(null)

    const [proceed, setProceed] = React.useState(false)
    
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    const AMOUNT_OUT_OF_RANGE = amount! > MAX_THRESHHOLD || amount! < MIN_THRESHHOLD

    const processDynamicAirtimePlan = () => {
        if (amount! < MIN_THRESHHOLD) return toast.warning('Airtime Amount should not be less than: ' + formatNigerianNaira(MIN_THRESHHOLD))
        if (amount! > MAX_THRESHHOLD) return toast.warning('Airtime Amount should not exceed: ' + formatNigerianNaira(MAX_THRESHHOLD))
        setSelected({
            CashBack:( amount! * 0.04).toString()  + '.00',
            Plan_ID: 0,
            plan_type: 'VTU',
            Price: (amount!)?.toString()! + '.00'
        })
        setOpenConfirmPurchaseModal?.(true)
    }

    const processFixedAirtimePlan = (plan: SubAirtimeProps) => {
        if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')

        setSelected(plan)
        setOpenConfirmPurchaseModal?.(true)
    }

  return (
    <div className='flex flex-col gap-y-4'>
        <div className='rounded-xl bg-white dark:bg-card/80 md:p-5 p-2 grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4'>
            {object[currentNetwork]?.slice(0, 5)?.map((plan, idx) => (
                <Card
                    key={idx}
                    className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all"
                    onClick={() => processFixedAirtimePlan(plan)}
                >
                    <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                        <p className="font-semibold text-base">{formatNigerianNaira(priceToInteger(plan?.Price!))}</p>
                        <p className='tracking-tighter'>Pay {formatNigerianNaira(priceToInteger(plan?.Price!))}</p>
                        <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                            <span>{plan?.CashBack}</span>
                            <span>Cashback</span>
                        </div>
                    </div>
                </Card>
            ))}

            <Suspense fallback={<LoadingOverlay />}>
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
            </Suspense>

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
                placeholder={`Enter Airtime Amount (${formatNigerianNaira(MIN_THRESHHOLD)} - ${formatNigerianNaira(MAX_THRESHHOLD)})`}
                id='amount'
                type='number'
            />
            <Button 
                className={cn('rounded-full mt-4', {
                    'opacity-50 cursor-not-allowed': AMOUNT_OUT_OF_RANGE
                })}

                onClick={processDynamicAirtimePlan}
                disabled={AMOUNT_OUT_OF_RANGE}
            >
                {amount ? 'Pay ' + formatNigerianNaira(amount!) : 'Proceed'}
            </Button>
        </div>
    </div>
  )
}

export default AirtimeCards