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
import { updateWalletBalanceByUser } from "@/lib/supabase/wallets"
import { insertTransactionHistory } from "@/lib/supabase/history"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { useRouter } from "next/navigation"

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
    const router = useRouter()

    const [purchasing, setPurchasing] = React.useState(false)

    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {
        const price = priceToInteger(payload.Price)
        const networkId = networkIds[currentNetwork]

        setPurchasing(true)

        const { OK, data, status, error } = await buyData({
            "request-id": `Data_${nanoid(24)}`,
            bypass: false,
            data_plan: payload.Plan_ID,
            network: networkId,
            phone: mobileNumber
        })

        // if (error) return

        if (OK) {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (wallet?.data?.balance! - price))
            if (_balanceError) return

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

            toast.success(`Congratulations!`, {
                description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })
            setPurchasing(false)
        } else {
            toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.')
            setPurchasing(false)
        }

        try {
            console.log(payload, price)
        } catch (error) {
            console.error(error)
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
                purchasing && (<LoadingOverlay isPending={purchasing} loader="2" />)
            }
        </SubDatContext.Provider>
    )
}

export const useNetwork = () => {
    if (!React.useContext(SubDatContext)) throw new Error('useNetwork must be used within a SubDataProvider')

    return React.useContext(SubDatContext)
}

export default SubDataProvider
