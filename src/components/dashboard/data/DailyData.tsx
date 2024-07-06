'use client'

import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Card } from '@/components/ui/card'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { parseDataName } from '@/funcs/parse-data-name'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { airtelData, etisalatData, gloData, mtnData } from '@/lib/vtpass/data'
import { useNetwork } from '@/providers/data/sub-data-provider'
import { PaymentMethod, SubDataProps } from '@/types/networks'
import React, { useState } from 'react'
import { toast } from 'sonner'

const object = {
  'mtn': mtnData.daily.map(plan => ({...plan, detail: parseDataName(plan.name, 'mtn')})),
  'glo': gloData.daily.map(plan => ({...plan, detail: parseDataName(plan.name, 'glo')})),
  'airtel': airtelData.daily.map(plan => ({...plan, detail: parseDataName(plan.name, 'airtel')})),
  '9mobile': etisalatData.daily.map(plan => ({...plan, detail: parseDataName(plan.name, '9mobile')}))
}

const product = {
  'mtn': {
      name: 'MTN',
      image: '/images/networks/mtn.png'
  },
  'glo': {
      name: 'GLO',
      image: '/images/networks/glo.png'
  },
  'airtel': {
      name: 'AIRTEL',
      image: '/images/networks/airtel.png'
  },
  '9mobile': {
      name: '9MOBILE',
      image: '/images/networks/9mobile.png'
  }
}

const DailyData = () => {
  const { currentNetwork, handleSubData, mobileNumber } = useNetwork()
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = useState<{} | null>(null)
    const {data: wallet, isPending} = useGetWalletBalance()

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    if (isPending) return <LoadingOverlay />

  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {object[currentNetwork]?.map(({detail, ...d}, idx) => (
            <Card
                key={idx}
                className="shadow-none cursor-pointer hover:transition-all rounded-sm hover:bg-violet-50 border-none drop-shadow-none bg-violet-100 rounded-tr-3xl p-2"
                onClick={() => {
                    if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
                    if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')

                    setSelected({})
                    setOpen(true)
                }}
            >
                <div className="flex flex-col gap-y-1 items-center text-xs md:text-sm hover:transition-all">
                    <p className="font-semibold text-base">{detail.dataQty}</p>
                    <p>{detail.duration.replaceAll('(', '').replaceAll(')', '')}</p>
                    <p>{formatNigerianNaira(priceToInteger(d?.variation_amount!))}</p>
                    <div className="flex flex-row items-center gap-1 text-violet-600 text-[9px] md:text-xs bg-violet-50 rounded-full px-2 p-1">
                        <span>{formatNigerianNaira(parseFloat(d?.cashback!))}</span>
                        <span>Cashback</span>
                    </div>
                </div>
            </Card>
        ))}
    </div>
  )
}

export default DailyData