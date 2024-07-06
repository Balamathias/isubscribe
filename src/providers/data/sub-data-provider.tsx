'use client'

import React from "react"
import LoadingOverlay from "@/components/loaders/LoadingOverlay"
import { parseWithInterestPrice, priceToInteger } from "@/funcs/priceToNumber"
import { buyAirtime, buyData } from "@/lib/n3tdata"
import { useGetWalletBalance } from "@/lib/react-query/funcs/wallet"
import { Tables } from "@/types/database"
import { Networks, PaymentMethod, SubAirtimeProps, SubDataProps } from "@/types/networks"
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
    handleSubAirtime: () => {}
})

const networkIds = {
    mtn: 1,
    airtel: 2,
    glo: 3,
    '9mobile': 4
}

const SubDataProvider = ({ children, profile, action='data' }: SubDataProviderProps) => {
    const { data: wallet, isPending } = useGetWalletBalance()
    const [currentNetwork, setCurrentNetwork] = React.useState<Networks>('mtn')
    const [mobileNumber, setMobileNumber] = React.useState<string>(profile?.phone || '')
    const [pinPasses, setPinPasses] = React.useState<boolean>(false)
    const [fundSufficient, setFundSufficient] = React.useState<boolean>(false)
    const [purchaseSuccess, setPurchaseSuccess] = React.useState(false)
    const [purchaseFailed, setPurchaseFailed] = React.useState(false)
    const [dataAmount, setDataAmount] = React.useState('0.00GB') /* @note: could be temporary. I hate too much useStates! */
    const router = useRouter()

    const [purchasing, setPurchasing] = React.useState(false)

    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {
        const price = parseWithInterestPrice(payload.Price)
        const cashbackPrice = parseWithInterestPrice(payload.CashBack!)
        const networkId = networkIds[currentNetwork]
        setDataAmount(payload.Data)

        let balance = 0.00
        let deductableAmount = 0.00

        let cashbackBalance = wallet?.data?.cashback_balance ?? 0.00

        if (payload.method === 'wallet') {
            balance = wallet?.data?.balance ?? 0.00
            deductableAmount = price
            cashbackBalance += cashbackPrice
        } else if (payload.method === 'cashback') {
            cashbackBalance = wallet?.data?.cashback_balance ?? 0.00
            deductableAmount = price
            cashbackBalance -= deductableAmount
            cashbackBalance += cashbackPrice

            if (cashbackBalance < 0) return /** @example: Ensure that cashbackBalance is not below 0 */
        } else {
            return
        }

        if (balance < 0) return /** @example: Edge case, balance cannot be negative! */

        setPurchasing(true)

        if (balance < price) {
            setPurchasing(false)
            return
        }

        const { OK, data, status, error } = await buyData({
            "request-id": `Data_${nanoid(24)}`,
            bypass: false,
            data_plan: payload.Plan_ID,
            network: networkId,
            phone: mobileNumber
        })

        /** if (error) return, @example: You could uncomment this only in edge cases */

        if (error) {
            setPurchaseFailed(true)
            const { data: insertHistory } = await insertTransactionHistory({
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

            router.refresh()
        }

        if (OK) {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))
            if (_balanceError) return

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))

            if (_balanceError || _cashbackBalanceError) return

            const { data: insertHistory } = await insertTransactionHistory({
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

            router.refresh()

            setPurchaseSuccess(true)
            /** @example: toast.success(`Congratulations!`, {
                description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })*/
            setPurchasing(false)
        } else {
            /** @tutorial: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
            setPurchasing(false)
            setPurchaseFailed(true)
        }
    }

    const handleSubAirtime = async (payload: SubAirtimeProps & { method?: PaymentMethod }) => {
        const price = priceToInteger(payload.Price)
        const cashbackPrice = priceToInteger(payload.CashBack!)
        const networkId = networkIds[currentNetwork]
        // setDataAmount(payload.Data)

        let balance = 0.00
        let deductableAmount = 0.00

        let cashbackBalance = wallet?.data?.cashback_balance ?? 0.00

        if (payload.method === 'wallet') {
            balance = wallet?.data?.balance ?? 0.00
            deductableAmount = price
            cashbackBalance += cashbackPrice
        } else if (payload.method === 'cashback') {
            cashbackBalance = wallet?.data?.cashback_balance ?? 0.00
            deductableAmount = price
            cashbackBalance -= deductableAmount
            cashbackBalance += cashbackPrice

            if (cashbackBalance < 0) return /** @example: Ensure that cashbackBalance is not below 0 */
        } else {
            return
        }

        if (balance < 0) return /** @example: Edge case, balance cannot be negative! */

        setPurchasing(true)

        if (balance < price) {
            setPurchasing(false)
            return
        }

        const { OK, data, status, error } = await buyAirtime({
            "request-id": `Airtime_${nanoid(24)}`,
            bypass: false,
            network: networkId,
            phone: mobileNumber,
            amount: price,
            plan_type: 'VTU'
        })

        /** if (error) return, @example: You could uncomment this only in edge cases */

        if (error) {
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

            router.refresh()
        }

        if (OK) {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))
            if (_balanceError) return

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))

            if (_balanceError || _cashbackBalanceError) return

            const { data: insertHistory } = await insertTransactionHistory({
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
            /** @example: toast.success(`Congratulations!`, {
                description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })*/
            setPurchasing(false)
        } else {
            /** @tutorial: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
            setPurchasing(false)
            setPurchaseFailed(true)
        }
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
            setFundSufficient
        }}>
            { children }
            {
                purchasing && (<LoadingOverlay />)
            }

            <DataPurchaseStatusPopup
                closeModal={() => setPurchaseSuccess(false)}
                dataAmount={dataAmount}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
                action={action}
            />

            <DataPurchaseStatusPopup
                closeModal={() => setPurchaseFailed(false)}
                dataAmount={dataAmount}
                fullName={profile?.full_name!}
                open={purchaseFailed}
                phoneNumber={mobileNumber}
                failed
                action={action}
            />
        </SubDatContext.Provider>
    )
}

export const useNetwork = () => {
    if (!React.useContext(SubDatContext)) throw new Error('useNetwork must be used within a SubDataProvider')

    return React.useContext(SubDatContext)
}

const DataPurchaseStatusPopup = ({closeModal, dataAmount, fullName, open, phoneNumber, failed, action='data', airtimeAmount}: {
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
                            Sorry {fullName}!, Your attempt to top up {action === 'data' ? dataAmount : airtimeAmount} for {phoneNumber} has failed. Please try again.
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
