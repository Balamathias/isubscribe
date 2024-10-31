import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { useTvCable } from '@/providers/tv-cable/tv-cable-provider'
import { PaymentMethod } from '@/types/networks'
import { SubTvPayload } from '@/types/tv-cable'
import { dstv_subscription, gotv_subscription, showmax_subscription, startimes_subscription } from '@/utils/constants/tv-plans'
import React, { useState } from 'react'
import { toast } from 'sonner'
import ConfirmPurchaseModal from './ConfirmPurchaseModal'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import { Tv, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import TvSelector from './TvSelector'

const object = {
    'dstv': dstv_subscription,
    'gotv': gotv_subscription,
    'startimes': startimes_subscription,
    'showmax': showmax_subscription
}

const TvCards = () => {
    const [open, setOpen] = React.useState(false)
    const [openMobileNumber, setOpenMobileNumber] = React.useState(false)
    const { data: profile, isPending: profilePending } = useGetProfile()

    const [selected, setSelected] = useState<SubTvPayload | null>(null)

    const {data: wallet, isPending} = useGetWalletBalance()

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    const { currentProvider, smartcardNumber, mobileNumber, setMobileNumber, openConfirmPurchaseModal, setOpenConfirmPurchaseModal, handleBuyTvCable} = useTvCable()

    if (isPending || profilePending) return <LoadingOverlay />

  return (
    <div className=' gap-2 gap-y-4 bg-card p- rounded-xl dark:bg-card/60'>

        <TvSelector object={object} selected={selected} setSelected={setSelected} />



       {
             <ConfirmPurchaseModal 
                open={openConfirmPurchaseModal!}
                paymentMethod={paymentMethod}
                selected={selected as any}
                setOpen={setOpenConfirmPurchaseModal}
                setPaymentMethod={setPaymentMethod}
                setProceed={setProceed}
                key={'tv-cable'}
                title='Tv cable Purchase details...'
            />
        }

        {
            <DynamicModal
                open={proceed}
                setOpen={setProceed}
                dismissible
                dialogClassName={'sm:max-w-fit dark:bg-card'}
                drawerClassName={'sm:max-w-fit dark:bg-card'}
            >
                <ConfirmPin className='rounded-none' 
                    func={() => {
                        handleBuyTvCable?.({...selected!, method: paymentMethod})
                        // setOpen(false)
                        setProceed(false)
                    }} 
                    profile={profile?.data!}
                />
            </DynamicModal>
        }
        {
            <DynamicModal
                open={openMobileNumber}
                setOpen={setOpenMobileNumber}
                dismissible
                dialogOnly
                dialogClassName={'sm:w-[94vw] md:w-[500px]'}
            >
                <div className="bg-white p-4 flex flex-row gap-2 shadow-none items-center  justify-center w-full">
                    <span className="text-white p- rounded-full bg-violet-500 p-1 md:p-2">
                    <User />
                    </span>
                    <Input 
                    onChange={(e) => setMobileNumber(e.target.value)}  
                    type="tel" 
                    defaultValue={mobileNumber}
                    placeholder="Enter Phone Number here..."
                        />
                </div>
            </DynamicModal>
        }
    </div>
  )
}

export default TvCards