"use client"

import { processElectricity } from '@/actions/electricity'
import CopyButton from '@/components/CopyButton'
import ShareReciept from '@/components/dashboard/ShareReciept'
import DynamicModal from '@/components/DynamicModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tables } from '@/types/database'
import { PaymentMethod } from '@/types/networks'
import { SubTvPayload } from '@/types/tv-cable'
import { LucideCheckCircle2, LucideXCircle, Share, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface SubTvProviderProps {
  children?: React.ReactNode,
  profile?: Tables<'profile'>,
  action?: 'tv-cable' | 'electricity' | "education",
  wallet?: Tables<'wallet'> | null
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
  historyId: string,
  fee: number,
  totalAmount: number,
  wallet?: Tables<'wallet'> | null

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
  historyId: '',
  fee: 0,
  totalAmount: 0
})

const ElectricityProvider = ({ children, profile, action='electricity', wallet }: SubTvProviderProps) => {
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
  const [cableAmount, setCableAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [powerAmount, setPowerAmount] = React.useState('') /* @note: could be temporary. I hate too much useStates! */
  const [purchasing, setPurchasing] = React.useState(false)
  const [openConfirmPurchaseModal, setOpenConfirmPurchaseModal] = React.useState(false)
  const [resData, setResData] = useState<string | null>(null)
  const router = useRouter()

  const [historyId, setHistoryId] = useState('')

  const fee = React.useMemo(() => parseFloat(powerAmount) * (3/100), [powerAmount])
  const totalAmount = React.useMemo(() => parseFloat(powerAmount) + fee, [powerAmount, fee])

  const handleBuyElectricity = async ( payload: SubTvPayload & { method?: PaymentMethod }) => {

    setCableAmount(payload?.variation_amount)

    try {
      setPurchasing(true)

      const {
        data,
        error,
        extra
      } = await processElectricity({
        amount: powerAmount,
        meterNumber: meterNumber,
        method: payload.method || 'wallet',
        phone: mobileNumber,
        price: parseFloat(payload.variation_amount),
        provider: currentProvider,
        variation: isPrepaid ? "prepaid" : "postpaid",
        cashback: 0,
        fee
      })

      console.log(data)

      if (error && !data) {
        toast.error(error?.message || 'Transaction attempt failed!')
      }

      if (data?.status === 'success') {
        setPurchaseSuccess(true)
        setResData(data?.token!)
        toast.success(data?.message)
      }

      if (data?.status === 'pending') {
        setPurchasePending(true)
        toast.warning(data?.message)
      }

      setHistoryId(extra?.historyId?.toString()!)

    } catch (error: any) {
      toast.error(error?.message?.includes('fetch failed') ? `Network error, please confirm that you were debited before performing another transaction` : error?.message)
      console.error(error)
    } finally {
      setPurchasing(false)
      setOpenConfirmPurchaseModal(false)

      router.refresh()
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
        setOpenConfirmPurchaseModal,
        historyId,
        fee,
        totalAmount,
        wallet
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
                token={resData!}
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

const SubPurchaseStatus = ({closeModal, fullName, currentProvider, open, phoneNumber, meterNumber, failed, pending, action='electricity', powerAmount, token}: {
  phoneNumber: string,
  meterNumber:string,
  fullName: string,
  currentProvider: string,
  open: boolean,
  token?:string,
  closeModal: () => void,
  failed?: boolean,
  pending?: boolean,
  action?: 'tv-cable' | 'electricity' | "education",
  powerAmount?: string | number
}) => {

  const { historyId } = useElectricity()
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
                        <p className='font-[500px]  text-black dark:text-white '> {token} </p>
                        <div className=' self-end'>
                        <CopyButton content={token!} className=' self-en p-1 hover:bg-transparent' />
                        </div>
                       </div>
                       <ShareReciept freeData={"100MB"} rLink={"#"} sLink={"#"} historyId={historyId} />
                     </div>  
                    )
              }
              

              <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : pending ? "destructive" : 'default'} onClick={() => closeModal()}>Close</Button>
          </div>
      </DynamicModal>
  )
}

export default ElectricityProvider