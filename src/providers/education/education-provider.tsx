"use client"

import { processEducation } from '@/actions/education'
import DynamicModal from '@/components/DynamicModal'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { computeTransaction } from '@/funcs/computeTransaction'
import generateRequestId from '@/funcs/generateRequestId'
import { priceToInteger } from '@/funcs/priceToNumber'
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { insertTransactionHistory } from '@/lib/supabase/history'
import { updateCashbackBalanceByUser, updateWalletBalanceByUser } from '@/lib/supabase/wallets'
import { cn } from '@/lib/utils'
import { buyEducation, buyElectricity, buyTvCable } from '@/lib/vtpass/services'
import { Tables } from '@/types/database'
import { PaymentMethod } from '@/types/networks'
import { SubTvPayload, TvCables } from '@/types/tv-cable'
import { EVENT_TYPE } from '@/utils/constants/EVENTS'
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react'
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
  profileCode: string,
  setProfileCode: React.Dispatch<React.SetStateAction<string>>,
  providerName:string,
  setProviderName:React.Dispatch<React.SetStateAction<string>>,
  providerImage:string,
  setProviderImage:React.Dispatch<React.SetStateAction<string>>,
  educationAmount: string,
  setEducationAmount: React.Dispatch<React.SetStateAction<string>>,
  mobileNumber: string,
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>,
  pinPasses?: boolean,
  setPinPasses?: React.Dispatch<React.SetStateAction<boolean>>,
  isUTME?: boolean,
  setIsUTME?: React.Dispatch<React.SetStateAction<boolean>>,
  purchasing?:boolean,
  openConfirmPurchaseModal?: boolean,
  setOpenConfirmPurchaseModal?: React.Dispatch<React.SetStateAction<boolean>>,
  fundSufficient: boolean,
  setFundSufficient: React.Dispatch<React.SetStateAction<boolean>>,
  handleBuyEducation?: (payload: SubTvPayload & { method?: PaymentMethod }) => void,

}>({
  currentProvider: '',
  setCurrentProvider: () => {},
  smartcardNumber: '',
  setSmartcardNumber: () => {},
  providerName:'',
  setProviderName:() => {},
  providerImage:'',
  setProviderImage:() => {},
  profileCode:'',
  setProfileCode:() => {},
  isUTME:true,
  setIsUTME:() => {},
  purchasing:false,
  openConfirmPurchaseModal: false,
  setOpenConfirmPurchaseModal: () => {},
  educationAmount:"",
  setEducationAmount:() => {},
  mobileNumber: '',
  setMobileNumber: () => {},
  pinPasses: false,
  setPinPasses: () => {},
  fundSufficient: false,
  setFundSufficient: () => {},
  handleBuyEducation: () => {},
})

const EducationProvider = ({ children, profile, action='education' }: SubTvProviderProps) => {
  const { data: wallet, isPending } = useGetWalletBalance()
  const [currentProvider, setCurrentProvider] = React.useState('waec')
  const [providerName, setProviderName] = React.useState('WASSCE/GCE Result Checker PIN')
  const [providerImage, setProviderImage] = React.useState('/images/electricity/ikeja.jpeg')
  const [smartcardNumber, setSmartcardNumber] = React.useState<string>('')
  const [profileCode, setProfileCode] = React.useState<string>('')
  const [mobileNumber, setMobileNumber] = React.useState<string>('')
  const [pinPasses, setPinPasses] = React.useState<boolean>(false)
  const [isUTME, setIsUTME] = React.useState<boolean>(true);
  const [fundSufficient, setFundSufficient] = React.useState<boolean>(false)
  const [purchaseSuccess, setPurchaseSuccess] = React.useState(false)
  const [purchaseFailed, setPurchaseFailed] = React.useState(false)
  const [purchasePending, setPurchasePending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const [successMessage, setSuccessMessage] = React.useState<string>('')
  const [smount, setAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
  const [educationAmount, setEducationAmount] = React.useState('3500.00') /* @note: could be temporary. I hate too much useStates! */
  const [purchasing, setPurchasing] = React.useState(false)
  const [resData, setResData] = useState<any>(null)
  const [openConfirmPurchaseModal, setOpenConfirmPurchaseModal] = React.useState<boolean>(false)
  const router = useRouter()

  const handleBuyEducation = async (method: PaymentMethod, payload: SubTvPayload & { method?: PaymentMethod }) => {
    try {
        const requestPayload = {
            billersCode: profileCode,
            phone: mobileNumber,
            serviceID: currentProvider === "jamb" ? "jamb" : "waec",
            variation_code: currentProvider === "jamb" ? (isUTME ? "utme" : "de") : "waecdirect",
            amount: educationAmount,
        };

        const billerPayload = {
            cashback: payload?.cashBack,
            price: educationAmount,
            method: method,
        };

        const metadata: Record<string, any> = {
            billersCode: profileCode,
            phone: mobileNumber,
            serviceID: requestPayload.serviceID,
            variation_code: requestPayload.variation_code,
        };

        setPurchasing(true);

        const { data, error, extra } = await processEducation({
            currentProvider: requestPayload?.serviceID,
            educationAmount: parseFloat(educationAmount),
            method: billerPayload?.method,
            mobileNumber,
            profileCode: requestPayload?.billersCode,
            variation_amount: parseFloat(educationAmount),
            cashBack: parseFloat(billerPayload?.cashback??'0'),
            isUTME,
        });

        if (error) {
            setPurchasing(false);
            setOpenConfirmPurchaseModal(false);
            setPurchaseFailed(true);
            setErrorMessage(error?.message || "Education subscription failed. Please try again.");
            router.refresh();
            return;
        }

        if (data) {
            if (data?.status === "success") {
                setSuccessMessage(data?.message || "Education subscription successful. Thank you for choosing isubscribe.");
                vibrate("success");
            } else {
                setSuccessMessage(data?.message || "Education subscription is pending. We will notify you once completed.");
                vibrate("info");
            }

            if (extra?.cashbackPrice) {
                toast.info(`You have received a cashback bonus of ₦${extra.cashbackPrice}`);
            }

            setHistoryId(extra?.historyId);
            router.refresh();

            queryClient.invalidateQueries({ queryKey: [QueryKeys.get_wallet] });

            setPurchasing(false);
            setOpenConfirmPurchaseModal(false);
            setPurchaseSuccess(true);
        } else {
            setPurchasing(false);
            setOpenConfirmPurchaseModal(false);
            setPurchaseFailed(true);
        }
    } catch (error: any) {
        setPurchasing(false);
        setOpenConfirmPurchaseModal(false);
        setPurchaseFailed(true);
        toast.error(error?.message || "An unexpected error occurred.");
    } finally {
        setPurchasing(false);
        setOpenConfirmPurchaseModal(false);
    }
};


//   const handleBuyEducation = async ( payload: SubTvPayload & { method?: PaymentMethod }) => {
//     // console.log("PPPPPPP", "₦" + payload?.variation_amount + ".00")
//     const billerPayload = {
//       CashBack:payload?.cashBack,
//       Price:"₦" + payload?.variation_amount,
//       method:payload?.method
//     }

//     setAmount(payload?.amount?.toString()!)

//     const requestPayload = {
//       billersCode: profileCode,
//       phone: mobileNumber,
//       serviceID:currentProvider === "jamb" ? "jamb" : "waec",
//       variation_code:currentProvider === "jamb" ? isUTME ? "utme" : "de" : "waecdirect",
//       amount:educationAmount,
//     }

//     console.log("CCPPPP", currentProvider)
//     console.log("REQQQPPPP", requestPayload)

//     const values = computeTransaction({
//         payload: {
//             cashback: 0,
//             price: priceToInteger(billerPayload.Price),
//             method: billerPayload.method
//         },
//         wallet: wallet?.data!
//     })
//     if (!values) return

//     const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values


//     setPurchasing(true)

//     const res: any = await buyEducation({
//         ...requestPayload as any,
//         request_id: generateRequestId()
//     })

//     if (!res) return toast.error('Transaction attempt failed!')
//     setResData(res as any)

//     console.log("Eduuuuuu", res)
    


//     /** if (error) return, @example: You could uncomment this only in edge cases */

//     const transRes = {...res?.content?.transactions, pin: res?.cards?.[0]?.Pin, serial: res?.cards?.[0]?.Serial, profile_code: profileCode}

//     if ( res?.response_description === "TRANSACTION FAILED"  || transRes?.status === 'failed') {
//       setPurchaseFailed(true)
//       const { data: insertHistory } = await insertTransactionHistory({
//           description: `Education subscription for ${profileCode} failed.`,
//           status: 'failed',
//           title: 'Education Subscription',
//           type: EVENT_TYPE.education_topup,
//           email: null,
//           meta_data: JSON.stringify(transRes),
//           updated_at: null,
//           user: profile?.id!,
//           amount: price,
//       })
//       router.refresh()
//       setPurchasing(false)
//       setOpenConfirmPurchaseModal(false)

//       return
//   }


//   if (res?.response_description === "TRANSACTION PROCESSING - PENDING" || transRes?.status === 'pending') {
            
//     const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
//         (balance - deductableAmount))
//     if (_balanceError) {
//         await updateWalletBalanceByUser(profile?.id!, 
//             (balance - deductableAmount))
//         return
//     }

//     const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
//         (cashbackBalance))

//     if (_balanceError || _cashbackBalanceError) return

//     const { data: _insertHistory } = await insertTransactionHistory({
//         description: `Education subscription for profile cod: ${profileCode} failed.`,
//         status: 'pending',
//         title: 'Education Subscription',
//         type: EVENT_TYPE.education_topup,
//         email: null,
//         meta_data: JSON.stringify(transRes),
//         updated_at: null,
//         user: profile?.id!,
//         amount: price
//     })

//     router.refresh()

//     setPurchasePending(true)
//     /** 
//      * @example: toast.success(`Congratulations!`, {
//         description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
//     })
//     */
//     setPurchasing(false)
//     setOpenConfirmPurchaseModal(false)
// }




//   if (res?.response_description === "TRANSACTION SUCCESSFULL" || transRes?.status === 'delivered') {
            
//     const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
//         (balance - deductableAmount))
//     if (_balanceError) {
//         await updateWalletBalanceByUser(profile?.id!, 
//             (balance - deductableAmount))
//         return
//     }

//     const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
//         (cashbackBalance))

//     if (_balanceError || _cashbackBalanceError) return

//     const { data: _insertHistory } = await insertTransactionHistory({
//         description: `Education subscription for profile code: ${profileCode} was successful`,
//         status: 'success',
//         title: 'Education Subscription',
//         type: EVENT_TYPE.education_topup,
//         email: null,
//         meta_data: JSON.stringify(transRes),
//         updated_at: null,
//         user: profile?.id!,
//         amount: price,
//     })

//     router.refresh()
//     // setPurchasePending(false)

//     setPurchaseSuccess(true)
//     /** 
//      * @example: toast.success(`Congratulations!`, {
//         description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
//     })
//     */
//     setPurchasing(false)
//     setOpenConfirmPurchaseModal(false)
// } 

// }

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
        handleBuyEducation,
        profileCode,
        setProfileCode,
        isUTME,
        setIsUTME,
        purchasing,
        educationAmount,
        setEducationAmount,
        providerImage,
        setProviderImage,
        providerName,
        setProviderName,
        openConfirmPurchaseModal,
        setOpenConfirmPurchaseModal,
        
       
      }}
    >
       {children}

           <SubPurchaseStatus
                closeModal={() => setPurchaseSuccess(false)}
                educationAmount={educationAmount}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
                action={action}
                profileCode={profileCode}
                resData={resData}
                currentProvider={currentProvider}
                isUTME={isUTME}
            /> 
            <SubPurchaseStatus
                closeModal={() => setPurchaseFailed(false)}
                educationAmount={educationAmount}
                fullName={profile?.full_name!}
                open={purchaseFailed}
                phoneNumber={mobileNumber}
                failed
                action={action}
                profileCode={profileCode}
                currentProvider={currentProvider}
                isUTME={isUTME}


            />

            <SubPurchaseStatus
                closeModal={() => setPurchasePending(false)}
                educationAmount={educationAmount}
                fullName={profile?.full_name!}
                open={purchasePending}
                phoneNumber={mobileNumber}
                pending
                action={action}
                profileCode={profileCode}
                currentProvider={currentProvider}
                isUTME={isUTME}
            />
    </SubTvContext.Provider>
  )
}


export const useEducation = () => {
  if (!React.useContext(SubTvContext)) throw new Error('useEducation must be used within a SubDataProvider')

  return React.useContext(SubTvContext)
}





const SubPurchaseStatus = ({closeModal, fullName, open, phoneNumber, currentProvider, isUTME, profileCode, failed, pending, action='electricity', educationAmount, resData}: {
  phoneNumber: string,
  profileCode:string,
  fullName: string,
  currentProvider?:string,
  open: boolean,
  resData?:any,
  closeModal: () => void,
  failed?: boolean,
  pending?: boolean,
  isUTME?:boolean,
  action?: 'tv-cable' | 'electricity' | "education",
  educationAmount?: string | number
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
                          Sorry {fullName}!, Your attempt to purchased {currentProvider === "jamb" ? "JAMB PIN" : "WAEC PIN"}. has failed. Please check the details and try again.
                      </p>
                  ) :  pending ? (
                      <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                           Sorry {fullName}!, Your attempt to purchased {currentProvider === "jamb" ? "JAMB PIN" : "WAEC PIN"} is pending. Kindly go to transaction history page and query the status.
                      </p>
                  )
                   : (
                      <div className=' flex flex-col space-y-1'>
                      <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                          Congratulations {fullName}!, You have successfully purchased {currentProvider === "jamb" ? "JAMB PIN" : "WAEC PIN"}. <br /> Thank you for choosing iSubscribe.
                      </p>

                      <div className='bg-violet-100 dark:bg-secondary flex flex-col space-y-1 p-2 rounded-sm'>
                      { resData?.cards ?
                       (
                           resData?.cards?.map((item:any, idx:number) => (
                               <div key={idx} className=' flex flex-col gap-1'>
                                    <div className='flex flex-row justify-between items-center gap-x-2'>
                                    <p className='font-semibold text-muted-foreground'>Pin:</p>
                                    <p>{item?.Pin}</p>
                                    </div>
                                    <div className='flex flex-row justify-between items-center gap-x-2'>
                                    <p className='font-semibold text-muted-foreground'>Serial:</p>
                                    <p>{item?.Serial}</p>
                                    </div>
                               </div>
                           ))
                        ) :
                        <div className=' space-y-1'>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Pin:</p>
                        <p>{resData?.Pin}</p>
                       </div>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Profile Code:</p>
                        <p>{profileCode}</p>
                        </div>
                       </div>
                      }
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Phone Number:</p>
                        <p>{resData?.content?.transactions?.phone}</p>
                       </div>
                        <div className='flex flex-row justify-between items-center gap-x-2'>
                        <p className='font-semibold text-muted-foreground'>Amount:</p>
                        <p>{educationAmount}</p>
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

export default EducationProvider