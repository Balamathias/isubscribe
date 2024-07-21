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

const object = {
    'dstv': dstv_subscription,
    'gotv': gotv_subscription,
    'startimes': startimes_subscription,
    'showmax': showmax_subscription
}

const TvCards = () => {
    const [open, setOpen] = React.useState(false)
    const [openMobileNumber, setOpenMobileNumber] = React.useState(false)

    const [selected, setSelected] = useState<SubTvPayload | null>(null)

    const {data: wallet, isPending} = useGetWalletBalance()

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    const { currentProvider, smartcardNumber, mobileNumber, setMobileNumber, handleBuyTvCable} = useTvCable()

    console.log("SELEC", selected)
    console.log("Smaaa", smartcardNumber)

    // if(openMobileNumber === true)  toast.warning("Heyyyyyyyyyyyyyyyyyyyy")



  return (
    <div className='rounded-xl bg-white md:min-h-[300px] dark:bg-background md:p-5 p-2 grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4'>
        {object[currentProvider]?.map((d, idx) => (
            <Card
                key={idx}
                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2 h-fit"
                onClick={() => {
                    if (!smartcardNumber) return toast.warning('Please enter your decoder number, it can\'t be empty!')
                    if ((smartcardNumber.length < 10) || (smartcardNumber.length > 10)) return toast.warning('Please enter a valid 10-digit decorder number')
                    if ((mobileNumber.length < 12) || (mobileNumber.length > 12)) return toast.warning('Please enter a valid 11-digit phone number')
                    // if ((mobileNumber.length < 12) || (mobileNumber.length > 12)) return setOpenMobileNumber(true)

                    setSelected(d as any)
                    setOpen(true)
                }}
            >
                <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                    <p className="font-semibold text-base">{formatNigerianNaira(priceToInteger(d.variation_amount))}</p>
                    <p className='tracking-tighter'>Pay N{priceToInteger(d?.variation_amount)}</p>
                    <div className="flex flex-row items-center justify-center flex-wrap gap-1 text-violet-600 text-[5px] md:text-xs bg-violet-50 rounded-full px-2 p-1">
                        <span>{d?.cashBack}</span>
                        <span>Cashback</span>
                    </div>
                </div>
            </Card>
        ))}



       {
            open && <ConfirmPurchaseModal 
                open={open}
                paymentMethod={paymentMethod}
                selected={selected as any}
                setOpen={setOpen}
                setPaymentMethod={setPaymentMethod}
                setProceed={setProceed}
                key={'tv-cable'}
                title='Tv cable Purchase details...'
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
                    handleBuyTvCable?.({...selected!, method: paymentMethod})
                    setOpen(false)
                    setProceed(false)
                }} />
            </DynamicModal>
        }
        {
            openMobileNumber && <DynamicModal
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