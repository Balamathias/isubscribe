'use client'

import React from "react"
import LoadingOverlay from "@/components/loaders/LoadingOverlay"
import { priceToInteger } from "@/funcs/priceToNumber"
import { buyData } from "@/lib/n3tdata"
import { useGetWalletBalance } from "@/lib/react-query/funcs/wallet"
import { Tables } from "@/types/database"
import { Networks, PaymentMethod, SubDataProps } from "@/types/networks"
import { nanoid } from 'nanoid'
import { toast } from "sonner"
import { updateCashbackBalanceByUser, updateWalletBalanceByUser } from "@/lib/supabase/wallets"
import { insertTransactionHistory } from "@/lib/supabase/history"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { useRouter } from "next/navigation"
import DynamicModal from "@/components/DynamicModal"
import { Button } from "@/components/ui/button"
import { LucideCheckCircle2 } from "lucide-react"

interface SubDataProviderProps {
    children?: React.ReactNode,
    profile?: Tables<'profile'>
}

const SubDatContext = React.createContext<{
    currentNetwork: Networks,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Networks>>,
    handleSubData?: (payload: SubDataProps & { method?: PaymentMethod }) => void,
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
    setFundSufficient: () => {}
})

const networkIds = {
    mtn: 1,
    airtel: 2,
    glo: 3,
    '9mobile': 4
}

const SubDataProvider = ({ children, profile }: SubDataProviderProps) => {
    const { data: wallet, isPending } = useGetWalletBalance()
    const [currentNetwork, setCurrentNetwork] = React.useState<Networks>('mtn')
    const [mobileNumber, setMobileNumber] = React.useState<string>(profile?.phone || '')
    const [pinPasses, setPinPasses] = React.useState<boolean>(false)
    const [fundSufficient, setFundSufficient] = React.useState<boolean>(false)
    const [purchaseSuccess, setPurchaseSuccess] = React.useState(false)
    const [dataAmount, setDataAmount] = React.useState('0.00GB') // @note: could be temporary. I hate too much useStates!
    const router = useRouter()

    const [purchasing, setPurchasing] = React.useState(false)

    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {
        const price = priceToInteger(payload.Price)
        const cashbackPrice = priceToInteger(payload.CashBack!)
        const networkId = networkIds[currentNetwork]
        setDataAmount(payload.Data)

        let balance = 0.00
        let deductableAmount = 0.00

        if (payload.method === 'wallet') {
            balance = wallet?.data?.balance ?? 0.00
            deductableAmount = price
        } else if (payload.method === 'cashback') {
            balance = wallet?.data?.cashback_balance ?? 0.00
            deductableAmount = price
        } else {
            return
        }

        if (balance < 0) return // @note: Edge case, balance cannot be negative!

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

        // if (error) return, @note: You could uncomment this only in edge cases

        if (OK) {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount), wallet?.data?.cashback_balance! + cashbackPrice)
            if (_balanceError) return

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (balance - deductableAmount))

            if (_balanceError || _cashbackBalanceError) return

            const { data: insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${mobileNumber}`,
                status: 'success',
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify(data),
                updated_at: null,
                user: profile?.id!
            })

            router.refresh()

            setPurchaseSuccess(true)
            toast.success(`Congratulations!`, {
                description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })
            setPurchasing(false)
        } else {
            toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.')
            setPurchasing(false)
        }
    }

    if (isPending) return <LoadingOverlay />

    return (
        <SubDatContext.Provider value={{
            currentNetwork,
            setCurrentNetwork,
            handleSubData,
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

            <DataPurchaseSuccessPopup
                closeModal={() => setPurchaseSuccess(false)}
                dataAmount={dataAmount}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
            />
        </SubDatContext.Provider>
    )
}

export const useNetwork = () => {
    if (!React.useContext(SubDatContext)) throw new Error('useNetwork must be used within a SubDataProvider')

    return React.useContext(SubDatContext)
}

const DataPurchaseSuccessPopup = ({closeModal, dataAmount, fullName, open, phoneNumber}: {
    dataAmount: string,
    phoneNumber: string,
    fullName: string,
    open: boolean,
    closeModal: () => void
}) => {
    return (
        <DynamicModal
            open={open}
            closeModal={closeModal}
        >
            <div className="flex flex-col gap-y-1 p-3 items-center justify-center">
                <LucideCheckCircle2 size={38} className="text-green-600 mb-1" />
                <h2 className="text-green-600 md:text-lg text-base">Success!</h2>
                <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                    Congratulations {fullName}!, You have successfully topped up {dataAmount} for {phoneNumber}. Thank you for choosing iSubscribe.
                </p>

                <Button className="w-full my-2 rounded-lg" size={'lg'} onClick={() => closeModal()}>Close</Button>
            </div>
        </DynamicModal>
    )
}

export default SubDataProvider
