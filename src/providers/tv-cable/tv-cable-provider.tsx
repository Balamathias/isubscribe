"use client"

import { computeTransaction } from '@/funcs/computeTransaction'
import generateRequestId from '@/funcs/generateRequestId'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { buyTvCable } from '@/lib/vtpass/services'
import { Tables } from '@/types/database'
import { PaymentMethod } from '@/types/networks'
import { SubTvPayload, TvCables } from '@/types/tv-cable'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { any } from 'zod'

interface SubTvProviderProps {
  children?: React.ReactNode,
  profile?: Tables<'profile'>,
  action?: 'tv-cable' | 'electricity' | "education"
}

const SubTvContext = React.createContext<{
  currentProvider: TvCables,
  setCurrentProvider: React.Dispatch<React.SetStateAction<TvCables>>,
  smartcardNumber: string,
  setSmartcardNumber: React.Dispatch<React.SetStateAction<string>>,
  mobileNumber: string,
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>,
  pinPasses?: boolean,
  setPinPasses?: React.Dispatch<React.SetStateAction<boolean>>,
  fundSufficient: boolean,
  setFundSufficient: React.Dispatch<React.SetStateAction<boolean>>,
  handleBuyTvCable?: (payload: SubTvPayload & { method?: PaymentMethod }) => void,

}>({
  currentProvider: 'dstv',
  setCurrentProvider: () => {},
  smartcardNumber: '',
  setSmartcardNumber: () => {},
  mobileNumber: '',
  setMobileNumber: () => {},
  pinPasses: false,
  setPinPasses: () => {},
  fundSufficient: false,
  setFundSufficient: () => {},
  handleBuyTvCable: () => {},
})

const TvCableProvider = ({ children, profile, action='tv-cable' }: SubTvProviderProps) => {
  const { data: wallet, isPending } = useGetWalletBalance()
  const [currentProvider, setCurrentProvider] = React.useState<TvCables>('dstv')
  const [smartcardNumber, setSmartcardNumber] = React.useState<string>('')
  const [mobileNumber, setMobileNumber] = React.useState<string>('')
  const [pinPasses, setPinPasses] = React.useState<boolean>(false)
  const [fundSufficient, setFundSufficient] = React.useState<boolean>(false)
  const [purchaseSuccess, setPurchaseSuccess] = React.useState(false)
  const [purchaseFailed, setPurchaseFailed] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [cableAmount, setCableAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [powerAmount, setPowerAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [purchasing, setPurchasing] = React.useState(false)
  const router = useRouter()



  const handleBuyTvCable = async ( payload: SubTvPayload & { method?: PaymentMethod }) => {
    // console.log("PPPPPPP", payload)
    const billerPayload = {
      CashBack:payload?.cashBack,
      Price:payload?.variation_amount,
      method:payload?.method
    }

    const requestPayload = {
      billersCode: '1212121212',
      phone: mobileNumber,
      subscription_type:"Renew",
      serviceID:currentProvider,
      variation_code:payload?.variation_code,
      amount:payload?.variation_amount,
    }

    const values = computeTransaction({
        payload: {...billerPayload} as any,
        wallet: wallet?.data!
    })
    if (!values) return

    const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values

    const res = await buyTvCable({
        ...requestPayload as any,
        request_id: generateRequestId()
    })

    if (!res) return toast.error('Transaction attempt failed!')
    // const {} = res

    console.log("TVCABLE", res)
}

  return (
    <SubTvContext.Provider value={{
        currentProvider,
        setCurrentProvider,
        setSmartcardNumber,
        smartcardNumber,
        mobileNumber,
        setMobileNumber,
        pinPasses,
        setPinPasses,
        fundSufficient,
        setFundSufficient,
        handleBuyTvCable,
      }}
    >
       {children}
    </SubTvContext.Provider>
  )
}


export const useTvCable = () => {
  if (!React.useContext(SubTvContext)) throw new Error('useTvCable must be used within a SubDataProvider')

  return React.useContext(SubTvContext)
}

export default TvCableProvider