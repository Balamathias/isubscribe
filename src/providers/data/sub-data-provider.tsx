'use client'

import React from "react"
import LoadingOverlay from "@/components/loaders/LoadingOverlay"
import { parseWithInterestPrice, priceToInteger } from "@/funcs/priceToNumber"
import { buyAirtime, buyData } from "@/lib/n3tdata"
import { useGetWalletBalance } from "@/lib/react-query/funcs/wallet"
import { Tables } from "@/types/database"
import { Networks, PaymentMethod, SubAirtimeProps, SubDataProps, VTPassDataPayload } from "@/types/networks"
import { nanoid } from 'nanoid'
import { toast } from "sonner"
import { updateCashbackBalanceByUser, updateWalletBalanceByUser } from "@/lib/supabase/wallets"
import { insertTransactionHistory } from "@/lib/supabase/history"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { useRouter } from "next/navigation"
import DynamicModal from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { LucideCheckCircle2, LucideXCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { networkIds } from "@/utils/networks"
import { computeTransaction } from "@/funcs/computeTransaction"

import { buyData as buyVTPassData } from "@/lib/vtpass/services"
import generateRequestId from "@/funcs/generateRequestId"

interface SubDataProviderProps {
    children?: React.ReactNode,
    profile?: Tables<'profile'>,
    action?: 'airtime' | 'data'
}

const SubDatContext = React.createContext<{
    currentNetwork: Networks,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Networks>>,
    handleSubData?: (payload: SubDataProps & { method?: PaymentMethod }) => void,
    handleSubAirtime?: (payload: SubAirtimeProps & { method?: PaymentMethod }) => void,
    mobileNumber: string,
    setMobileNumber: React.Dispatch<React.SetStateAction<string>>,
    pinPasses?: boolean,
    setPinPasses?: React.Dispatch<React.SetStateAction<boolean>>,
    fundSufficient: boolean,
    setFundSufficient: React.Dispatch<React.SetStateAction<boolean>>,
    handleVTPassData: (method: PaymentMethod, payload: VTPassDataPayload) => void
}>({
    currentNetwork: 'mtn',
    setCurrentNetwork: () => {},
    handleSubData: () => {},
    mobileNumber: '',
    setMobileNumber: () => {},
    pinPasses: false,
    setPinPasses: () => {},
    fundSufficient: false,
    setFundSufficient: () => {},
    handleSubAirtime: () => {},
    handleVTPassData: () => {}
})


const SubDataProvider = ({ children, profile, action='data' }: SubDataProviderProps) => {
    const { data: wallet, isPending } = useGetWalletBalance()
    const [currentNetwork, setCurrentNetwork] = React.useState<Networks>('mtn')
    const [mobileNumber, setMobileNumber] = React.useState<string>(profile?.phone || '')
    const [pinPasses, setPinPasses] = React.useState<boolean>(false)
    const [fundSufficient, setFundSufficient] = React.useState<boolean>(false)
    const [purchaseSuccess, setPurchaseSuccess] = React.useState(false)
    const [purchaseFailed, setPurchaseFailed] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState<string>('')
    const [successMessage, setSuccessMessage] = React.useState<string>('')
    const [dataAmount, setDataAmount] = React.useState('0.00GB') /* @note: could be temporary. I hate too much useStates! */
    const [airtimeAmount, setAirtimeAmount] = React.useState('0.00') /* @note: could be temporary. I hate too much useStates! */
    const router = useRouter()

    const [purchasing, setPurchasing] = React.useState(false)

    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {
        const values = computeTransaction({
            payload: {
                price: parseInt(payload.Price),
                cashback: parseInt(payload.CashBack),
                method: payload.method
            },
            wallet: wallet?.data!
        })
        if (!values) return

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values

        const networkId = networkIds[currentNetwork]
        setDataAmount(payload.Data)
        setPurchasing(true)

        const { data, error } = await buyData({
            "request-id": `Data_${nanoid(24)}`,
            bypass: false,
            data_plan: payload.Plan_ID,
            network: networkId,
            phone: mobileNumber
        })

        /** if (error) return, @example: You could uncomment this only in edge cases */

        if (error || (data?.status === 'fail')) {
            setPurchaseFailed(true)
            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${mobileNumber} failed.`,
                status: 'failed',
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify(data),
                updated_at: null,
                user: profile?.id!,
                amount: price,
            })
            setPurchasing(false)
            setErrorMessage(data?.message ?? 'Data subscription failed. Please try again.')

            router.refresh()
            return
        }

        setPurchasing(false)

        if (data?.status === 'success') {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))
            if (_balanceError) {
                await updateWalletBalanceByUser(profile?.id!, 
                    (balance - deductableAmount))
                    setPurchasing(false)
                return
            }

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))

            if (_balanceError || _cashbackBalanceError) return setPurchasing(false)

            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${mobileNumber}`,
                status: 'success',
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify(data),
                updated_at: null,
                user: profile?.id!,
                amount: price
            })
            setSuccessMessage(data?.message ?? 'Data subscription successful. Thank you for choosing iSubscribe.')

            router.refresh()

            setPurchaseSuccess(true)
            /** 
             * @example: toast.success(`Congratulations!`, {
                description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })
            */
            setPurchasing(false)
        } else {
            /** @example: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
            setPurchasing(false)
            setPurchaseFailed(true)
        }
    }

    const handleSubAirtime = async (payload: SubAirtimeProps & { method?: PaymentMethod }) => {
        const values = computeTransaction({
            payload: {
                price: parseInt(payload.Price),
                cashback: parseInt(payload.CashBack),
                method: payload.method
            },
            wallet: wallet?.data!
        })
        if (!values) return

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values
        
        const networkId = networkIds[currentNetwork]
        setAirtimeAmount(payload.Price)
        setPurchasing(true)

        const { data, error } = await buyAirtime({
            "request-id": `Airtime_${nanoid(24)}`,
            bypass: false,
            network: networkId,
            phone: mobileNumber,
            amount: price,
            plan_type: 'VTU'
        })

        /** if (error) return, @example: You could uncomment this only in edge cases */

        if (error || data?.status === 'fail') {
            setPurchaseFailed(true)
            const { data: insertHistory } = await insertTransactionHistory({
                description: `Airtime subscription for ${mobileNumber} failed.`,
                status: 'failed',
                title: 'Airtime Subscription',
                type: EVENT_TYPE.airtime_topup,
                email: null,
                meta_data: JSON.stringify(data),
                updated_at: null,
                user: profile?.id!,
                amount: price,
            })
            setPurchasing(false)

            router.refresh()
            return
        }

        if (data?.status === 'success') {
            
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
                description: `Airtime subscription for ${mobileNumber}`,
                status: 'success',
                title: 'Airtime Subscription',
                type: EVENT_TYPE.airtime_topup,
                email: null,
                meta_data: JSON.stringify(data),
                updated_at: null,
                user: profile?.id!,
                amount: price
            })

            router.refresh()

            setPurchaseSuccess(true)
            /** 
             * @example: toast.success(`Congratulations!`, {
                description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })
            */
            setPurchasing(false)
        } else {
            /** @tutorial: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
            setPurchasing(false)
            setPurchaseFailed(true)
        }
    }

    const handleVTPassData = async (method: PaymentMethod, payload: VTPassDataPayload) => {
        setDataAmount(payload.detail?.dataQty!)
        const values = computeTransaction({
            payload: {
                price: (payload.amount as number),
                cashback: (payload.cashback as number),
                method
            },
            wallet: wallet?.data!
        })
        if (!values) return toast.info('Please verify all inputs.')

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values

        setPurchasing(true)
        const res = await buyVTPassData({
            ...payload,
            request_id: generateRequestId(),
            billersCode: '08011111111',
            phone: mobileNumber,
        })

        if (!res) {
            setPurchasing(false)
            setPurchaseFailed(true)
            return
        }
        
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))
            if (_balanceError) {
                await updateWalletBalanceByUser(profile?.id!, 
                    (balance - deductableAmount))
                    setPurchasing(false)
                return
            }

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))

            if (_balanceError || _cashbackBalanceError) return setPurchasing(false)

            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${mobileNumber}`,
                status: 'success',
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify({...res,
                    transactionId: generateRequestId(),
                    time: new Date().toISOString(),
                }),
                updated_at: null,
                user: profile?.id!,
                amount: price
            })
            setSuccessMessage(res?.response_description ?? 'Data subscription successful. Thank you for choosing iSubscribe.')

            router.refresh()

            setPurchaseSuccess(true)
            setPurchasing(false)
    }

    if (isPending) return <LoadingOverlay />

    return (
        <SubDatContext.Provider value={{
            currentNetwork,
            setCurrentNetwork,
            handleSubData,
            handleSubAirtime,
            mobileNumber,
            setMobileNumber,
            pinPasses,
            setPinPasses,
            fundSufficient,
            setFundSufficient,
            handleVTPassData,
        }}>
            { children }
            {
                purchasing && (<LoadingOverlay />)
            }

            <SubPurchaseStatus
                closeModal={() => setPurchaseSuccess(false)}
                dataAmount={dataAmount}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
                action={action}
                airtimeAmount={airtimeAmount}
            />

            <SubPurchaseStatus
                closeModal={() => setPurchaseFailed(false)}
                dataAmount={dataAmount}
                fullName={profile?.full_name!}
                open={purchaseFailed}
                phoneNumber={mobileNumber}
                failed
                action={action}
                airtimeAmount={airtimeAmount}
            />
        </SubDatContext.Provider>
    )
}

export const useNetwork = () => {
    if (!React.useContext(SubDatContext)) throw new Error('useNetwork must be used within a SubDataProvider')

    return React.useContext(SubDatContext)
}

const SubPurchaseStatus = ({closeModal, dataAmount, fullName, open, phoneNumber, failed, action='data', airtimeAmount}: {
    dataAmount: string,
    phoneNumber: string,
    fullName: string,
    open: boolean,
    closeModal: () => void,
    failed?: boolean,
    action?: 'data' | 'airtime',
    airtimeAmount?: string | number
}) => {
    return (
        <DynamicModal
            open={open}
            closeModal={closeModal}
        >
            <div className="flex flex-col gap-y-1 p-3 items-center justify-center">
                {
                    failed ? (<LucideXCircle className="text-red-600 mb-1" />) : (<LucideCheckCircle2 size={38} className="text-green-600 mb-1" />)
                }
                <h2 className={cn("text-green-600 md:text-lg text-base", {'text-red-600': failed})}>{failed ? 'Purchase Failed' : 'Success'}!</h2>
                {
                    failed ? (
                        <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                            Sorry {fullName}!, Your attempt to top up {action === 'data' ? dataAmount : airtimeAmount} for {phoneNumber} has failed. Please check the details and try again.
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                            Congratulations {fullName}!, You have successfully topped up {action === 'data' ? dataAmount : airtimeAmount} for {phoneNumber}. Thank you for choosing iSubscribe.
                        </p>
                    )
                }

                <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : 'default'} onClick={() => closeModal()}>Close</Button>
            </div>
        </DynamicModal>
    )
}

export default SubDataProvider
