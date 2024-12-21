"use client"

import CopyButton from '@/components/CopyButton'
import ShareReciept from '@/components/dashboard/ShareReciept'
import DynamicModal from '@/components/DynamicModal'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { computeTransaction } from '@/funcs/computeTransaction'
import generateRequestId from '@/funcs/generateRequestId'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { insertTransactionHistory } from '@/lib/supabase/history'
import { updateCashbackBalanceByUser, updateWalletBalanceByUser } from '@/lib/supabase/wallets'
import { cn } from '@/lib/utils'
import { buyElectricity, buyTvCable } from '@/lib/vtpass/services'
import { Tables } from '@/types/database'
import { PaymentMethod } from '@/types/networks'
import { SubTvPayload, TvCables } from '@/types/tv-cable'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { LucideCheckCircle2, LucideXCircle, Share, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface SubTvProviderProps {
  children?: React.ReactNode,
  profile?: Tables<'profile'>,
  action?: 'tv-cable' | 'electricity' | "education"
}

const SubTvContext = React.createContext<{
  currentProvider: string,
  setCurrentProvider: React.Dispatch<React.SetStateAction<string>>,
  smartcardNumber: string,
  setSmartcardNumber: React.Dispatch<React.SetStateAction<string>>,
  meterNumber: string,
  setMeterNumber: React.Dispatch<React.SetStateAction<string>>,
  providerName:string,
  setProviderName:React.Dispatch<React.SetStateAction<string>>,
  providerImage:string,
  setProviderImage:React.Dispatch<React.SetStateAction<string>>,
  powerAmount: string,
  setPowerAmount: React.Dispatch<React.SetStateAction<string>>,
  mobileNumber: string,
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>,
  pinPasses?: boolean,
  setPinPasses?: React.Dispatch<React.SetStateAction<boolean>>,
  isPrepaid?: boolean,
  setIsPrepaid?: React.Dispatch<React.SetStateAction<boolean>>,
  purchasing?:boolean,
  openConfirmPurchaseModal?: boolean,
  setOpenConfirmPurchaseModal?: React.Dispatch<React.SetStateAction<boolean>>,
  fundSufficient: boolean,
  setFundSufficient: React.Dispatch<React.SetStateAction<boolean>>,
  handleBuyElectricity?: (payload: SubTvPayload & { method?: PaymentMethod }) => void,

}>({
  currentProvider: '',
  setCurrentProvider: () => {},
  smartcardNumber: '',
  setSmartcardNumber: () => {},
  providerName:'',
  setProviderName:() => {},
  providerImage:'',
  setProviderImage:() => {},
  meterNumber:'',
  setMeterNumber:() => {},
  isPrepaid:true,
  setIsPrepaid:() => {},
  purchasing:false,
  openConfirmPurchaseModal: false,
  setOpenConfirmPurchaseModal: () => {},
  powerAmount:"",
  setPowerAmount:() => {},
  mobileNumber: '',
  setMobileNumber: () => {},
  pinPasses: false,
  setPinPasses: () => {},
  fundSufficient: false,
  setFundSufficient: () => {},
  handleBuyElectricity: () => {},
})

const ElectricityProvider = ({ children, profile, action='electricity' }: SubTvProviderProps) => {
  const { data: wallet, isPending } = useGetWalletBalance()
  const [currentProvider, setCurrentProvider] = React.useState('ikeja-electric')
  const [providerName, setProviderName] = React.useState('Ikeja Electric')
  const [providerImage, setProviderImage] = React.useState('/images/electricity/ikeja.jpeg')
  const [smartcardNumber, setSmartcardNumber] = React.useState<string>('')
  const [meterNumber, setMeterNumber] = React.useState<string>('')
  const [mobileNumber, setMobileNumber] = React.useState<string>('')
  const [pinPasses, setPinPasses] = React.useState<boolean>(false)
  const [isPrepaid, setIsPrepaid] = React.useState<boolean>(true);
  const [fundSufficient, setFundSufficient] = React.useState<boolean>(false)
  const [purchaseSuccess, setPurchaseSuccess] = React.useState(false)
  const [purchaseFailed, setPurchaseFailed] = React.useState(false)
  const [purchasePending, setPurchasePending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [cableAmount, setCableAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [powerAmount, setPowerAmount] = React.useState('') /* @note: could be temporary. I hate too much useStates! */
  const [purchasing, setPurchasing] = React.useState(false)
  const [openConfirmPurchaseModal, setOpenConfirmPurchaseModal] = React.useState(false)
  const [resData, setResData] = useState(null)
  const router = useRouter()



  const handleBuyElectricity = async ( payload: SubTvPayload & { method?: PaymentMethod }) => {
    // console.log("PPPPPPP", "₦" + payload?.variation_amount + ".00")
    const billerPayload = {
      CashBack:payload?.cashBack,
      Price:"₦" + payload?.variation_amount + ".00",
      method:payload?.method
    }

    const requestPayload = {
      billersCode: meterNumber,
      phone: mobileNumber,
      serviceID:currentProvider,
      variation_code:isPrepaid ? "prepaid" : "postpaid",
      amount:powerAmount,
    }

    const values = computeTransaction({
        payload: {
            cashback: 0,
            price: priceToInteger(billerPayload.Price),
            method: billerPayload.method
        },
        wallet: wallet?.data!
    })
    if (!values) return

    const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values

    // console.log("mb", balance)
    // console.log("cb", cashbackBalance)
    // console.log("cp", cashbackPrice)
    // console.log("dA", deductableAmount)
    // console.log("p", price)

    setCableAmount(payload?.variation_amount)
    setPurchasing(true)

    const res = await buyElectricity({
        ...requestPayload as any,
        request_id: generateRequestId()
    })

    if (!res) return toast.error('Transaction attempt failed!')
    // const {} = res
    setResData(res as any)

    console.log("NEPPAAAAA", resData)

    /** if (error) return, @example: You could uncomment this only in edge cases */

    const transRes = res?.content?.transactions

    if ( res?.response_description === "TRANSACTION FAILED"  || transRes?.status === 'failed') {
      setPurchaseFailed(true)
      const { data: insertHistory } = await insertTransactionHistory({
          description: `Meter subscription for ${meterNumber} failed.`,
          status: 'failed',
          title: 'Meter Subscription',
          type: EVENT_TYPE.meter_topup,
          email: null,
          meta_data: JSON.stringify({...transRes, transId: res?.requestId, requestId: res?.requestId}),
          updated_at: null,
          user: profile?.id!,
          amount: price,
      })
      setPurchasing(false)
      setOpenConfirmPurchaseModal(false)

      router.refresh()
      return
  }


  if (res?.response_description === "TRANSACTION PROCESSING - PENDING" || transRes?.status === 'pending') {
            
    const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
        (balance - deductableAmount))
    if (_balanceError) {
        await updateWalletBalanceByUser(profile?.id!, 
            (balance - deductableAmount))
        return
    }

    const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
        (cashbackBalance))

    if (_balanceError || _cashbackBalanceError) return

    const { data: _insertHistory } = await insertTransactionHistory({
        description: `Meter subscription for ${meterNumber}`,
        status: 'pending',
        title: 'Meter Subscription',
        type: EVENT_TYPE.meter_topup,
        email: null,
        meta_data: JSON.stringify({...transRes, transId: res?.requestId, requestId: res?.requestId}),
        updated_at: null,
        user: profile?.id!,
        amount: price
    })

    router.refresh()

    setPurchasePending(true)
    /** 
     * @example: toast.success(`Congratulations!`, {
        description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
    })
    */
    setPurchasing(false)
    setOpenConfirmPurchaseModal(false)

}




  if (res?.response_description === "TRANSACTION SUCCESSFUL" || transRes?.status === 'delivered') {
            
    const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
        (balance - deductableAmount))
    if (_balanceError) {
        await updateWalletBalanceByUser(profile?.id!, 
            (balance - deductableAmount))
        return
    }

    const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
        (cashbackBalance))

    if (_balanceError || _cashbackBalanceError) return

    const { data: _insertHistory } = await insertTransactionHistory({
        description: `Meter subscription for ${meterNumber}`,
        status: 'success',
        title: 'Meter Subscription',
        type: EVENT_TYPE.meter_topup,
        email: null,
        meta_data: JSON.stringify({...transRes, transId: res?.requestId, requestId: res?.requestId}),
        updated_at: null,
        user: profile?.id!,
        amount: price
    })

    router.refresh()
    // setPurchasePending(false)

    setPurchaseSuccess(true)
    /** 
     * @example: toast.success(`Congratulations!`, {
        description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
    })
    */
    setPurchasing(false)
    setOpenConfirmPurchaseModal(false)

} 
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
        handleBuyElectricity,
        meterNumber,
        setMeterNumber,
        isPrepaid,
        setIsPrepaid,
        powerAmount,
        setPowerAmount,
        providerImage,
        setProviderImage,
        providerName,
        setProviderName,
        purchasing,
        openConfirmPurchaseModal,
        setOpenConfirmPurchaseModal
       
      }}
    >
       {children}
      {/* {purchasing && (<LoadingOverlay />)} */}

           <SubPurchaseStatus
                closeModal={() => setPurchaseSuccess(false)}
                powerAmount={powerAmount}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
                action={action}
                meterNumber={meterNumber}
                resData={resData}
                currentProvider={currentProvider}
            /> 
            <SubPurchaseStatus
                closeModal={() => setPurchaseFailed(false)}
                powerAmount={powerAmount}
                fullName={profile?.full_name!}
                open={purchaseFailed}
                phoneNumber={mobileNumber}
                failed
                action={action}
                meterNumber={meterNumber}
                currentProvider={currentProvider}

            />

            <SubPurchaseStatus
                closeModal={() => setPurchasePending(false)}
                powerAmount={powerAmount}
                fullName={profile?.full_name!}
                open={purchasePending}
                phoneNumber={mobileNumber}
                pending
                action={action}
                meterNumber={meterNumber}
                currentProvider={currentProvider}
            />
    </SubTvContext.Provider>
  )
}


export const useElectricity = () => {
  if (!React.useContext(SubTvContext)) throw new Error('useElectricity must be used within a SubDataProvider')

  return React.useContext(SubTvContext)
}





const SubPurchaseStatus = ({closeModal, fullName, currentProvider, open, phoneNumber, meterNumber, failed, pending, action='electricity', powerAmount, resData}: {
  phoneNumber: string,
  meterNumber:string,
  fullName: string,
  currentProvider: string,
  open: boolean,
  resData?:any,
  closeModal: () => void,
  failed?: boolean,
  pending?: boolean,
  action?: 'tv-cable' | 'electricity' | "education",
  powerAmount?: string | number
}) => {
  return (
      <DynamicModal
          open={open}
          closeModal={closeModal}
          dialogClassName="sm:max-w-[640px] md:max-w-[500px] "
          drawerClassName=''
      >
          <div className="flex flex-col gap-y-2 p-3 items-center justify-center">
              {
                  failed ? (<LucideXCircle className="text-red-600 mb-1" />) :
                  pending ? (<LucideXCircle className="text-yellow-600 mb-1" />) :
                  (<LucideCheckCircle2 size={38} className="text-green-600 mb-1" />)
              }
             
              <h2 className={cn("text-green-600 md:text-lg font-[500px] text-base", {'text-yellow-600': pending}, {'text-red-600': failed})}>{failed ? 'Purchase Failed' : pending ? "Pending" :  'Successful'}!</h2>
              <h2 className=' font-bold text-lg text-black dark:text-white'>₦ {powerAmount}</h2>
              {
                  failed ? (
                      <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                          Sorry {fullName}!, Your attempt to purchase <strong> ₦{powerAmount}</strong> Power for <strong>{meterNumber}</strong> has failed. Please check the details and try again.
                      </p>
                  ) :  pending ? (
                      <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                           Sorry {fullName}!, Your attempt to purchase <strong> ₦{powerAmount}</strong> Power for <strong>{meterNumber}</strong> is pending. Kindly go to transaction history page and query the status.
                      </p>
                  )
                   : (
                      <div className=' flex flex-col gap-5  max-md:w-[94vw] '>
                       <div className='flex bg-violet-10 border-2 border-dashed dark:bg-secondary w-full self-center px-2 rounded-sm flex-row justify-between items-center justify-cente gap-x-2'>
                        <p className='font-semibol text-muted-foreground '>Meter Token:</p>
                        <p className='font-[500px]  text-black dark:text-white '> {resData?.token || resData?.Token || resData?.mainToken} </p>
                        <div className=' self-end'>
                        <CopyButton content={resData?.token || resData?.Token || resData?.mainToken} className=' self-en p-1 hover:bg-transparent' />
                        </div>
                       </div>
                       <ShareReciept freeData={"100MB"} rLink={"#"} sLink={"#"}  />
                     </div>  
                    )
              }
              

              <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : pending ? "destructive" : 'default'} onClick={() => closeModal()}>Close</Button>
          </div>
      </DynamicModal>
  )
}

export default ElectricityProvider