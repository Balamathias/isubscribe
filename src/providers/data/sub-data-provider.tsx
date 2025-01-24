'use client'

import React, { useState } from "react"
import { buyAirtime } from "@/lib/n3tdata"
import { Tables } from "@/types/database"
import { Networks, PaymentMethod, SubAirtimeProps, SubDataProps, VTPassAirtimePayload, VTPassDataPayload } from "@/types/networks"
import { nanoid } from 'nanoid'
import { toast } from "sonner"
import { updateCashbackBalanceByUser, updateWalletBalanceByUser } from "@/lib/supabase/wallets"
import { insertTransactionHistory, saveCashbackHistory, saveDataErrorHistory } from "@/lib/supabase/history"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { useRouter } from "next/navigation"
import { networkIds } from "@/utils/networks"

import SubPurchaseStatus from "@/components/dashboard/sub-purchase-status"
import { AirtimeDataMetadata } from "@/types/airtime-data"
import { priceToInteger } from "@/funcs/priceToNumber"
import { useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/react-query/query-keys"
import useWalletStore from "@/store/use-wallet-store"
import { useGetProfile } from "@/lib/react-query/funcs/user"
import { DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils"
import useVibration from "@/hooks/use-vibration"
import { computeServerTransaction } from "@/actions/compute.server"
import { processData_n3t, processData_VTPass } from "@/actions/data"
import { processAirtime_VTPass } from "@/actions/airtime"

interface SubDataProviderProps {
    children?: React.ReactNode,
    profile?: Tables<'profile'>,
    action?: 'airtime' | 'data',
    wallet?: Tables<'wallet'> | null
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
    handleVTPassData: (method: PaymentMethod, payload: VTPassDataPayload) => void,
    handleVTPassAirtime: (method: PaymentMethod, payload: VTPassAirtimePayload) => void,
    purchasing?:boolean,
    openConfirmPurchaseModal?: boolean,
    setOpenConfirmPurchaseModal?: React.Dispatch<React.SetStateAction<boolean>>,
    historyId?: string | number,
    wallet?: Tables<'wallet'> | null
    profile?: Tables<'profile'> | null
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
    handleVTPassData: () => {},
    purchasing:false,
    openConfirmPurchaseModal: false,
    setOpenConfirmPurchaseModal: () => {},
    handleVTPassAirtime: () => {},
})


const SubDataProvider = ({ children, action='data', wallet, profile }: SubDataProviderProps) => {

    const queryClient = useQueryClient()

    const setWalletBalance = useWalletStore(state => state.setBalance)
    const vibrate = useVibration()

    // const { data: _profile } = useGetProfile()
    // const profile  = _profile?.data

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

    const [dataBonus, setDataBonus] = React.useState(0)
    const [historyId, setHistoryId] = useState<string | number>('')

    const router = useRouter()

    const [purchasing, setPurchasing] = React.useState(false)
    const [openConfirmPurchaseModal, setOpenConfirmPurchaseModal] = React.useState<boolean>(false)

    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {

        try {
            setDataAmount(payload.Data)

            const networkId = networkIds[currentNetwork]
            setPurchasing(true)

            let meta_data: AirtimeDataMetadata = {
                dataQty: payload?.Data ?? 0,
                duration: null,
                network: currentNetwork,
                status: 'success',
            } as any

            const {
                data,
                error,
                extra
            } = await processData_n3t({
                payload: {
                    Price: (payload.Price),
                    CashBack: (payload.CashBack),
                    method: payload.method,
                    commission: payload?.commission,
                    Data: payload?.Data
                },
                data_plan: payload.Plan_ID,
                network: networkId,
                phone: mobileNumber,
                currentNetwork,
                meta_data,
            })

            setDataBonus(extra?.cashbackPrice || 0)

            if (error) {

                console.error(error)

                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseFailed(true)

                setErrorMessage(error?.message || 'Data subscription failed. Please try again.')

                router.refresh()
                return
            }

            if (data) {

                setSuccessMessage(data?.message ?? 'Data subscription successful. Thank you for choosing isubscribe.')
                setHistoryId(extra?.historyId)

                router.refresh()
                
                if (extra?.status === 'success') {
                    vibrate('success')
                    toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(extra?.cashbackPrice * DATA_MB_PER_NAIRA)}`)
                } else {
                    toast.info("This transaction is pending, we will update you subsequently on the updates.")
                    vibrate('info')
                }

                queryClient.invalidateQueries({
                    queryKey: [QueryKeys.get_wallet]
                })
                
                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseSuccess(true)
            } 
            else {
                /** @example: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseFailed(true)
            }
        } catch (error: any) {
            toast.error(error?.message?.includes('fetch failed') ? `Network error, please confirm that you were debited before performing another transaction` : error?.message)
            console.error(error)
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
        } finally {
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
        }
    }

    const handleVTPassData = async (method: PaymentMethod, payload: VTPassDataPayload) => {

        try {
            setDataAmount(payload.detail?.dataQty!)

            const networkId = networkIds[currentNetwork]
            setPurchasing(true)

            let meta_data: AirtimeDataMetadata = {
                dataQty: payload?.detail?.dataQty ?? 0,
                duration: null,
                network: currentNetwork,
                status: 'success',
                phone: mobileNumber
            } as any

            const {
                data,
                error,
                extra
            } = await processData_VTPass({
                payload: {
                    price: (payload.amount as number),
                    cashback: (payload?.cashback as number),
                    method,
                    commission: 0 // (payload?.amount! * 0.04) // 0.04 is the commission rate for every plan
                },
                phone: mobileNumber,
                currentNetwork,
                meta_data,
                serviceID: payload.serviceID,
                variation_code: payload?.variation_code
            })

            setDataBonus(extra?.cashbackPrice || 0)

            if (error) {

                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseFailed(true)

                setErrorMessage(error?.message || 'Data subscription failed. Please try again.')

                router.refresh()
                return
            }

            if (data) {

                if (data?.status === 'success') {
                    setSuccessMessage(data?.message ?? 'Data subscription successful. Thank you for choosing iSubscribe.')
                    vibrate('success')
                } else {
                    setSuccessMessage(data?.message ?? 'Airtime subscription is pending, We will email you once the transaction is successful, stay tuned.')
                    vibrate('info')
                }
                
                setHistoryId(extra?.historyId)
                
                extra?.cashbackPrice && toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(extra?.cashbackPrice * DATA_MB_PER_NAIRA)}`)
                router.refresh()

                queryClient.invalidateQueries({
                    queryKey: [QueryKeys.get_wallet]
                })
                
                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseSuccess(true)
            } 

            else {
                /** @example: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseFailed(true)
            }
        } catch (error: any) {
            console.error(error)
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
            toast.error(error?.message?.includes('fetch failed') ? `Network error, please confirm that you were debited before performing another transaction` : error?.message)
        } finally {
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
        }
    }

    const handleVTPassAirtime = async (method: PaymentMethod, payload: VTPassAirtimePayload) => {

        try {
            setDataAmount(payload.amount.toString()!)
            setAirtimeAmount(payload.amount.toString())

            const networkId = networkIds[currentNetwork]
            setPurchasing(true)

            let meta_data: AirtimeDataMetadata = {
                dataQty: payload.amount ?? 0,
                duration: null,
                network: currentNetwork,
                status: 'success',
                phone: mobileNumber
            } as any

            const {
                data,
                error,
                extra
            } = await processAirtime_VTPass({
                payload: {
                    price: (payload.amount as number),
                    cashback: (payload?.cashback as number),
                    method,
                    commission: 0, // (payload?.amount! * 0.04) // 0.04 is the commission rate for every plan
                },
                phone: mobileNumber,
                currentNetwork,
                meta_data,
                serviceID: payload.serviceID,
            })

            setDataBonus(extra?.cashbackPrice || 0)

            if (error) {

                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseFailed(true)

                setErrorMessage(error?.message || 'Airtime subscription failed. Please try again.')

                router.refresh()
                return
            }

            if (data) {

                if (data?.status === 'success') {
                    setSuccessMessage(data?.message ?? 'Airtime subscription successful. Thank you for choosing isubscribe.')
                    vibrate('success')
                } else {
                    setSuccessMessage(data?.message ?? 'Airtime subscription is pending, We will email you once the transaction is successful, stay tuned.')
                    vibrate('info')
                }

                setHistoryId(extra?.historyId)
                router.refresh()

                if (extra?.cashbackPrice)
                    toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(extra?.cashbackPrice * DATA_MB_PER_NAIRA)}`)
                

                queryClient.invalidateQueries({
                    queryKey: [QueryKeys.get_wallet]
                })
                
                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseSuccess(true)
            } 

            else {
                setPurchasing(false)
                setOpenConfirmPurchaseModal(false)
                setPurchaseFailed(true)
            }
        } catch (error: any) {
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
            toast.error(error?.message?.includes('fetch failed') ? `Network error, please confirm that you were debited before performing another transaction` : error?.message)
        } finally {
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
        }
    }

    const handleSubAirtime = async (payload: SubAirtimeProps & { method?: PaymentMethod }) => {

        const { data: values, error: computeError } = await computeServerTransaction({
            payload: {
                price: parseInt(payload.Price),
                cashback: parseInt(payload.CashBack),
                method: payload.method,
            },
        })

        if (computeError || !values) return toast.error(computeError || 'An unknown error has occured, please try again.')

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values
        setDataBonus(cashbackPrice)
        
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
            let meta_data: AirtimeDataMetadata = {
                dataQty: dataAmount ?? 0,
                duration: null,
                network: currentNetwork,
                transId: data?.transid ?? null,
                unitCashback: cashbackPrice,
                unitPrice: price,
                description: data?.message,
                planType: data?.plan_type!,
                phone: mobileNumber,
                status: 'failed'
            }

            const { data: insertHistory } = await insertTransactionHistory({
                description: `Airtime subscription for ${mobileNumber} failed.`,
                status: 'failed',
                title: 'Airtime Subscription',
                type: EVENT_TYPE.airtime_topup,
                email: null,
                meta_data: JSON.stringify(meta_data),
                updated_at: null,
                user: profile?.id!,
                amount: priceToInteger(payload?.Price),
            })
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)

            router.refresh()
            return
        }

        if (data?.status === 'success') {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))

                setWalletBalance(_walletBalance.balance ?? 0)

            if (_balanceError) {
                await updateWalletBalanceByUser(profile?.id!, 
                    (balance - deductableAmount))
                return
            }

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))

            if (_balanceError || _cashbackBalanceError) return

            let meta_data: AirtimeDataMetadata = {
                dataQty: dataAmount ?? 0,
                duration: null,
                network: currentNetwork,
                transId: data?.transid ?? null,
                unitCashback: cashbackPrice,
                unitPrice: price,
                description: data?.message,
                planType: data?.plan_type!,
                phone: mobileNumber,
                status: 'success'
            }

            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Airtime subscription for ${mobileNumber}`,
                status: 'success',
                title: 'Airtime Subscription',
                type: EVENT_TYPE.airtime_topup,
                email: null,
                meta_data: JSON.stringify(meta_data),
                updated_at: null,
                user: profile?.id!,
                amount: price,
                commission: 0
            })

            router.refresh()
            toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA)}`)
            vibrate('success')
            setHistoryId(_insertHistory.id)
            await saveCashbackHistory({amount: cashbackPrice})

            /** 
             * @example: toast.success(`Congratulations!`, {
            description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
            })
            */
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.get_wallet]
            })

           setPurchasing(false)
           setOpenConfirmPurchaseModal(false)
           setPurchaseSuccess(true)
        } else {
            /** @tutorial: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
        }
    }

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
            handleVTPassAirtime,
            purchasing,
            openConfirmPurchaseModal,
            setOpenConfirmPurchaseModal,
            historyId,
            wallet,
            profile
        }}>
            { children }

            <SubPurchaseStatus
                closeModal={() => {
                    return setPurchaseSuccess(false)
                }}
                dataAmount={dataAmount}
                dataBonus={dataBonus}
                fullName={profile?.full_name!}
                open={purchaseSuccess}
                phoneNumber={mobileNumber}
                action={action}
                airtimeAmount={airtimeAmount}
                successMessage={successMessage}
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
                errorMessage={errorMessage}
            />
        </SubDatContext.Provider>
    )
}

export const useNetwork = () => {
    const context = React.useContext(SubDatContext)
    if (!context) 
        throw new Error('useNetwork must be used within a SubDataProvider')

    return context
}

export default SubDataProvider
