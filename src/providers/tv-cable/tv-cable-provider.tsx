"use client"

import DynamicModal from '@/components/DynamicModal'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { computeTransaction } from '@/funcs/computeTransaction'
import generateRequestId from '@/funcs/generateRequestId'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { insertTransactionHistory } from '@/lib/supabase/history'
import { updateCashbackBalanceByUser, updateWalletBalanceByUser } from '@/lib/supabase/wallets'
import { cn } from '@/lib/utils'
import { buyTvCable } from '@/lib/vtpass/services'
import { Tables } from '@/types/database'
import { PaymentMethod } from '@/types/networks'
import { SubTvPayload, TvCables } from '@/types/tv-cable'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
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
  purchasing?:boolean,
  openConfirmPurchaseModal?: boolean,
  setOpenConfirmPurchaseModal?: React.Dispatch<React.SetStateAction<boolean>>,
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
  purchasing:false,
  openConfirmPurchaseModal: false,
  setOpenConfirmPurchaseModal: () => {},
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
  const [purchasePending, setPurchasePending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [cableAmount, setCableAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [powerAmount, setPowerAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [purchasing, setPurchasing] = React.useState(false)
  const [openConfirmPurchaseModal, setOpenConfirmPurchaseModal] = React.useState<boolean>(false)
  const [resData, setResData] = useState(null)

  const router = useRouter()



  const handleBuyTvCable = async ( payload: SubTvPayload & { method?: PaymentMethod }) => {
    // console.log("PPPPPPP", payload)
    const billerPayload = {
      CashBack:payload?.cashBack,
      Price:payload?.variation_amount,
      method:payload?.method
    }

    const requestPayload = {
      billersCode: smartcardNumber,
      phone: mobileNumber,
      subscription_type:"Renew",
      serviceID:currentProvider,
      variation_code:payload?.variation_code,
      amount:payload?.variation_amount,
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

    const res = await buyTvCable({
        ...requestPayload as any,
        request_id: generateRequestId()
    })

    if (!res) return toast.error('Transaction attempt failed!')
    // const {} = res
    setResData(res as any)

    console.log("TVCABLE", resData)


    /** if (error) return, @example: You could uncomment this only in edge cases */

    const transRes = res?.content?.transactions

    if ( res?.response_description === "TRANSACTION FAILED" || transRes?.status === 'failed') {
      setPurchaseFailed(true)
      const { data: insertHistory } = await insertTransactionHistory({
          description: `Tv Cable subscription for ${smartcardNumber} failed.`,
          status: 'failed',
          title: 'Tv Subscription',
          type: EVENT_TYPE.tv_topup,
          email: null,
          meta_data: JSON.stringify(transRes),
          updated_at: null,
          user: profile?.id!,
          amount: price,
      })
      setPurchasing(false)

      router.refresh()
      setOpenConfirmPurchaseModal(false)
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
        description: `Tv subscription for ${smartcardNumber}`,
        status: 'pending',
        title: 'Tv Subscription',
        type: EVENT_TYPE.tv_topup,
        email: null,
        meta_data: JSON.stringify(transRes),
        updated_at: null,
        user: profile?.id!,
        amount: price
    })

    router.refresh()
    setOpenConfirmPurchaseModal(false)

    setPurchasePending(true)
    /** 
     * @example: toast.success(`Congratulations!`, {
        description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
    })
    */
    setPurchasing(false)
} 



  if (res?.response_description === "TRANSACTION SUCCESSFULL" || transRes?.status === 'delivered') {
            
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
        description: `Tv subscription for ${smartcardNumber}`,
        status: 'success',
        title: 'Tv Subscription',
        type: EVENT_TYPE.tv_topup,
        email: null,
        meta_data: JSON.stringify(transRes),
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
        handleBuyTvCable,
        purchasing,
        openConfirmPurchaseModal,
        setOpenConfirmPurchaseModal,
      }}
    >
       {children}
      {/* {purchasing && (<LoadingOverlay />)} */}

           <SubPurchaseStatus
                closeModal={() => setPurchaseSuccess(false)}
                tvAmount={cableAmount}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
                action={action}
                smartcardNumber={smartcardNumber}
                currentProvider={currentProvider}
                resData={resData}
            /> 
            <SubPurchaseStatus
                closeModal={() => setPurchaseFailed(false)}
                tvAmount={cableAmount}
                fullName={profile?.full_name!}
                open={purchaseFailed}
                phoneNumber={mobileNumber}
                failed
                action={action}
                smartcardNumber={smartcardNumber}
                currentProvider={currentProvider}
            />

            <SubPurchaseStatus
                closeModal={() => setPurchasePending(false)}
                tvAmount={cableAmount}
                fullName={profile?.full_name!}
                open={purchasePending}
                phoneNumber={mobileNumber}
                pending
                action={action}
                smartcardNumber={smartcardNumber}
                currentProvider={currentProvider}
            />
    </SubTvContext.Provider>
  )
}


export const useTvCable = () => {
  if (!React.useContext(SubTvContext)) throw new Error('useTvCable must be used within a SubDataProvider')

  return React.useContext(SubTvContext)
}





const SubPurchaseStatus = ({closeModal, fullName, open, phoneNumber,currentProvider, resData, smartcardNumber, failed, pending, action='tv-cable', tvAmount}: {
  phoneNumber: string,
  currentProvider:string,
  smartcardNumber:string,
  resData?:any,
  fullName: string,
  open: boolean,
  closeModal: () => void,
  failed?: boolean,
  pending?: boolean,
  action?: 'tv-cable' | 'electricity' | "education",
  tvAmount?: string | number
}) => {
  return (
      <DynamicModal
          open={open}
          closeModal={closeModal}
           dialogClassName="sm:max-w-[640px] md:max-w-[500px] "
           drawerClassName=''
      >
          <div className="flex flex-col gap-y-1 p-3 items-center justify-center">
              {
                  failed ? (<LucideXCircle className="text-red-600 mb-1" />) :
                  pending ? (<LucideXCircle className="text-yellow-600 mb-1" />) :
                  (<LucideCheckCircle2 size={38} className="text-green-600 mb-1" />)
              }
             
              <h2 className={cn("text-green-600 md:text-lg text-base", {'text-yellow-600': pending}, {'text-red-600': failed})}>{failed ? 'Purchase Failed' : pending ? "Pending" :  'Successful'}!</h2>
              {
                  failed ? (
                      <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                          Sorry {fullName}!, Your attempt to purchase <strong> ₦{tvAmount}</strong> Cable for <strong>{smartcardNumber}</strong> has failed. Please check the details and try again.
                      </p>
                  ) :  pending ? (
                      <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                           Sorry {fullName}!, Your attempt  to purchase <strong> ₦{tvAmount}</strong> Cable for <strong>{smartcardNumber}</strong> is pending. Kindly go to transaction history page and query the status.
                      </p>
                  )
                   : (
                      <div className=' flex flex-col space-y-1'>
                        <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                            Congratulations {fullName}!, You have successfully subscribe <strong> ₦{tvAmount}</strong> Cable for <strong>{smartcardNumber}</strong>.  <br /> Thank you for choosing iSubscribe.
                        </p>
                        <div className='bg-violet-100 dark:bg-secondary flex flex-col space-y-1 p-2 rounded-sm'>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Product Name:</p>
                        <p>{resData?.content?.transactions?.product_name}</p>
                        </div>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Amount:</p>
                        <p>{resData?.amount}</p>
                        </div>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Request ID:</p>
                        <p>{resData?.requestId}</p>
                        </div>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Transaction ID:</p>
                        <p>{resData?.content?.transactions?.transactionId}</p>
                        </div>
                        </div>

                      </div>
                  )
              }

              <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : pending ? "destructive" : 'default'} onClick={() => closeModal()}>Close</Button>
          </div>
      </DynamicModal>
  )
}

export default TvCableProvider