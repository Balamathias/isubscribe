'use client'

import DynamicModal from '@/components/DynamicModal'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, VTPassAirtimePayload } from '@/types/networks'
import React, { lazy, Suspense, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ConfirmPin from '../ConfirmPin'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import CustomInput from '../CustomInput'
import { Label } from '@/components/ui/label'
import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PleaseSignIn from '../please-sign-in.modal'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { Tables } from '@/types/database'

const ConfirmPurchaseModal = lazy(() => import('./confirm-purchase-modal-v2'))

const quickPlans = [
    100,
    200,
    500,
    1_000,
    2_000,
    5_000,
    8_000,
    10_000,
    15_000,
    20_000,
    25_000
]

const MAX_THRESHHOLD = 500_000
const MIN_THRESHHOLD = 50

const AirtimeCards = ({ profile }: { profile?: Tables<'profile'> }) => {
    const { currentNetwork, handleVTPassAirtime, mobileNumber, openConfirmPurchaseModal, setOpenConfirmPurchaseModal  } = useNetwork()
    const [selected, setSelected] = useState<VTPassAirtimePayload | null>(null)
    // const { data: profile, isPending: _profilePending } = useGetProfile()
    const [amount, setAmount] = useState<number | null>(null)

    const isDesktop = useMediaQuery("(min-width: 768px)")

    const [proceed, setProceed] = React.useState(false)
    
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    const queryClient = useQueryClient()

    const AMOUNT_OUT_OF_RANGE = amount! > MAX_THRESHHOLD || amount! < MIN_THRESHHOLD

    const processDynamicAirtimePlan = async () => {
        if (amount! < MIN_THRESHHOLD) return toast.warning('Airtime Amount should not be less than: ' + formatNigerianNaira(MIN_THRESHHOLD))
        if (amount! > MAX_THRESHHOLD) return toast.warning('Airtime Amount should not exceed: ' + formatNigerianNaira(MAX_THRESHHOLD))
        setSelected({
            amount: amount!,
            phone: mobileNumber,
            serviceID: currentNetwork === '9mobile' ? 'etisalat' : currentNetwork, // Convert (9mobile) to (etisalat)
            cashback: amount! * 0.01
        })
        setOpenConfirmPurchaseModal?.(true)

        await queryClient.invalidateQueries({ queryKey: [QueryKeys.get_wallet] })
    }

    const processFixedAirtimePlan = async (amount: number) => {
        if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
        if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')

        setSelected({
            amount: amount!,
            phone: mobileNumber,
            serviceID: currentNetwork === '9mobile' ? 'etisalat' : currentNetwork, // Convert (9mobile) to (etisalat)
            cashback: amount! * 0.01
        })
        setOpenConfirmPurchaseModal?.(true)
        await queryClient.invalidateQueries({ queryKey: [QueryKeys.get_wallet] })
    }

  return (
    <div className='flex flex-col gap-y-4'>
        <div className='rounded-xl bg-white dark:bg-card/80 md:p-5 p-2 grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4 shadow-sm'>
            {(quickPlans.slice(0, !isDesktop ? 6 : 10)).map((plan, idx) => (
                profile ? (
                    <Card
                        key={idx}
                        className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all"
                        onClick={() => processFixedAirtimePlan(plan)}
                    >
                        <div className="flex flex-col gap-y-2 items-center text-xs md:text-sm hover:transition-all">
                            <p className="font-semibold text-base">{formatNigerianNaira(plan)}</p>
                            <p className='tracking-tighter'>Pay {formatNigerianNaira(plan)}</p>
                            <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                                <span>+{formatDataAmount(plan * 0.01 * DATA_MB_PER_NAIRA)}</span>
                                <span className='sr-only'>Data bonus</span>
                            </div>
                        </div>
                    </Card>
                ): (
                    <PleaseSignIn 
                        message='Please sign in to buy airtime'
                        key={idx}
                        trigger={
                            <Card
                                key={idx}
                                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 dark:bg-secondary hover:opacity-50 hover:translate-all peer peer-hover:opacity-65 peer-hover:transition-all"
                            >
                                <div className="flex flex-col gap-y-2 items-center text-xs md:text-sm hover:transition-all">
                                    <p className="font-semibold text-base">{formatNigerianNaira(plan)}</p>
                                    <p className='tracking-tighter'>Pay {formatNigerianNaira(plan)}</p>
                                    <div className="flex flex-row items-center gap-1 text-violet-600 dark:text-muted-foreground text-[9px] bg-violet-50 dark:bg-gray-900 rounded-full px-2 p-1">
                                        <span>+{formatDataAmount(plan * 0.01 * DATA_MB_PER_NAIRA)}</span>
                                        <span className='sr-only'>Data bonus</span>
                                    </div>
                                </div>
                            </Card>
                        }
                    />
                )
            ))}

            {
                selected && (
                    <Suspense fallback={<LoadingOverlay />}>
                        <ConfirmPurchaseModal 
                            open={openConfirmPurchaseModal!}
                            paymentMethod={paymentMethod}
                            selected={selected!}
                            setOpen={setOpenConfirmPurchaseModal as any}
                            setPaymentMethod={setPaymentMethod}
                            setProceed={setProceed}
                            key={'airtime'}
                            title='Airtime Purchase details'
                            func={() => {
                                handleVTPassAirtime(paymentMethod, {...selected!})
                                setProceed(false)
                            }}
                        />
                    </Suspense>
                )
            }

            <DynamicModal
                open={proceed}
                setOpen={setProceed}
                dismissible
                dialogClassName={'sm:max-w-fit dark:bg-card'}
                drawerClassName='dark:bg-card'
                hideDrawerCancel
                >
                <ConfirmPin 
                    className='rounded-none' 
                    func={() => {
                        handleVTPassAirtime(paymentMethod, {...selected!})
                        setProceed(false)
                    }} 
                    profile={profile!}
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
            {
                profile ? (
                    <Button 
                        className={cn('rounded-lg mt-4 bg-gradient-to-r from-violet-600 to-pink-600', {
                            'opacity-50 cursor-not-allowed': AMOUNT_OUT_OF_RANGE
                        })}

                        onClick={processDynamicAirtimePlan}
                        disabled={AMOUNT_OUT_OF_RANGE}
                        size={'lg'}
                    >
                        {amount ? 'Pay ' + formatNigerianNaira(amount!) : 'Proceed'}
                    </Button>
                ): (
                    <PleaseSignIn
                        message='Please sign in to buy airtime'
                        trigger={
                            <Button 
                                className={cn('rounded-lg mt-4 bg-gradient-to-r from-violet-600 to-pink-600', {
                                    'opacity-50 cursor-not-allowed': AMOUNT_OUT_OF_RANGE
                                })}
                            >
                                {amount ? 'Pay ' + formatNigerianNaira(amount!) : 'Proceed'}
                            </Button>
                        }
                    />
                )
            }
        </div>
    </div>
  )
}

export default AirtimeCards