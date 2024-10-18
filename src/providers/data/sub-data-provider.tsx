'use client'

import React from "react"
import { buyAirtime, buyData } from "@/lib/n3tdata"
import { Tables } from "@/types/database"
import { Networks, PaymentMethod, SubAirtimeProps, SubDataProps, VTPassAirtimePayload, VTPassDataPayload } from "@/types/networks"
import { nanoid } from 'nanoid'
import { toast } from "sonner"
import { getWallet, updateCashbackBalanceByUser, updateWalletBalanceByUser } from "@/lib/supabase/wallets"
import { insertTransactionHistory, saveAirtimeErrorHistory, saveCashbackHistory, saveDataErrorHistory } from "@/lib/supabase/history"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { useRouter } from "next/navigation"
import { networkIds } from "@/utils/networks"
import { computeTransaction } from "@/funcs/computeTransaction"

import { buyData as buyVTPassData, buyAirtime as buyVTPassAirtime } from "@/lib/vtpass/services"
import generateRequestId from "@/funcs/generateRequestId"
import SubPurchaseStatus from "@/components/dashboard/sub-purchase-status"
import { AirtimeDataMetadata } from "@/types/airtime-data"
import { priceToInteger } from "@/funcs/priceToNumber"
import { RESPONSE_CODES } from "@/utils/constants/response-codes"
import { useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/react-query/query-keys"
import useWalletStore from "@/store/use-wallet-store"
import { useGetProfile } from "@/lib/react-query/funcs/user"
import { DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils"

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
    handleVTPassData: (method: PaymentMethod, payload: VTPassDataPayload) => void,
    handleVTPassAirtime: (method: PaymentMethod, payload: VTPassAirtimePayload) => void,
    purchasing?:boolean,
    openConfirmPurchaseModal?: boolean,
    setOpenConfirmPurchaseModal?: React.Dispatch<React.SetStateAction<boolean>>,
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
    handleVTPassAirtime: () => {}
})


const SubDataProvider = ({ children, action='data' }: SubDataProviderProps) => {

    const queryClient = useQueryClient()

    const setWalletBalance = useWalletStore(state => state.setBalance)

    const { data: _profile } = useGetProfile()
    const profile  = _profile?.data

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
    const router = useRouter()

    const [purchasing, setPurchasing] = React.useState(false)
    const [openConfirmPurchaseModal, setOpenConfirmPurchaseModal] = React.useState<boolean>(false)


    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {

        const { data: wallet } = await getWallet()

        const values = computeTransaction({
            payload: {
                price: priceToInteger(payload.Price),
                cashback: parseInt(payload.CashBack),
                method: payload.method
            },
            wallet: wallet!
        })
        if (!values) return

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values
        setDataBonus(cashbackPrice)

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
                status: 'failed',
            }
            
            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${mobileNumber} failed.`,
                status: 'failed',
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify(meta_data),
                updated_at: null,
                user: profile?.id!,
                amount: price,
                provider: 'n3t'
            })

            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
            setErrorMessage(data?.message ?? 'Data subscription failed. Please try again.')

            router.refresh()
            return
        }

        setPurchasing(false)

        if (data?.status === 'success') {
            
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))

            setWalletBalance(_walletBalance.balance ?? 0)

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))

            if (_balanceError || _cashbackBalanceError) return setPurchasing(false)

            let meta_data: AirtimeDataMetadata = {
                dataQty: dataAmount ?? 0,
                duration: null,
                network: currentNetwork,
                transId: data?.transid ?? null,
                unitCashback: cashbackPrice,
                unitPrice: price,
                description: data?.message,
                planType: data?.plan_type,
                phone: mobileNumber,
                status: 'success'
            }

            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription for ${mobileNumber}`,
                status: 'success',
                title: 'Data Subscription',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify(meta_data),
                updated_at: null,
                user: profile?.id!,
                amount: price,
                provider: 'n3t'
            })
            setSuccessMessage(data?.message ?? 'Data subscription successful. Thank you for choosing iSubscribe.')

            router.refresh()
            toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA)}`)
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
            /** @example: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
        }
    }

    const handleSubAirtime = async (payload: SubAirtimeProps & { method?: PaymentMethod }) => {

        const { data: wallet } = await getWallet()

        const values = computeTransaction({
            payload: {
                price: parseInt(payload.Price),
                cashback: parseInt(payload.CashBack),
                method: payload.method
            },
            wallet: wallet!
        })
        if (!values) return

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
                amount: price
            })

            router.refresh()
            toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA)}`)
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

    const handleVTPassData = async (method: PaymentMethod, payload: VTPassDataPayload) => {

        const { data: wallet } = await getWallet()

        setDataAmount(payload.detail?.dataQty!)

        const values = computeTransaction({
            payload: {
                price: (payload.amount as number),
                cashback: (payload.cashback as number),
                method
            },
            wallet: wallet!
        })

        if (!values) return

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values
        setDataBonus(cashbackPrice)

        setPurchasing(true)

        let meta_data: AirtimeDataMetadata = {
            dataQty: dataAmount ?? 0,
            duration: null,
            network: currentNetwork,
            transId: null,
            unitCashback: cashbackPrice,
            unitPrice: price,
            description: '',
            planType: null,
            phone: mobileNumber,
            status: 'success'
        }

        const res = await buyVTPassData({
            ...payload,
            request_id: generateRequestId(),
            billersCode: mobileNumber,
            phone: '08011111111',
        })

        if (!res) {
            setErrorMessage('An unknown error has occured, please try again.')
            await saveDataErrorHistory('An unknown error has occured, please try again.', {profiledId: profile?.id, meta_data: res ?? {}, price, mobile: mobileNumber})
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
            return
        }

        else if (res?.code === RESPONSE_CODES.TIME_NOT_CORRECT.code) {
            setErrorMessage(RESPONSE_CODES.TIME_NOT_CORRECT.message)
            await saveDataErrorHistory(RESPONSE_CODES.TIME_NOT_CORRECT.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TIME_NOT_CORRECT.message}, price, mobile: mobileNumber})
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            return
        }

        else if (res?.code === RESPONSE_CODES.TRANSACTION_FAILED.code) {
            setErrorMessage(RESPONSE_CODES.TRANSACTION_FAILED.message)
            await saveDataErrorHistory(RESPONSE_CODES.TRANSACTION_FAILED.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TRANSACTION_FAILED.message}, price, mobile: mobileNumber})
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            return
        }

        else if (res?.code === RESPONSE_CODES.NO_PRODUCT_VARIATION.code) {
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            setErrorMessage(RESPONSE_CODES.NO_PRODUCT_VARIATION.message)
            await saveDataErrorHistory(RESPONSE_CODES.NO_PRODUCT_VARIATION.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.NO_PRODUCT_VARIATION.message}, price, mobile: mobileNumber})
            return
        }
        
        else if (res?.code === RESPONSE_CODES.TRANSACTION_SUCCESSFUL.code) {
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))


            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))
            
                setWalletBalance(_walletBalance.balance ?? 0)

            if (_balanceError || _cashbackBalanceError) return setPurchasing(false)

            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Data subscription topped-up for ${mobileNumber} successfully.`,
                status: 'success',
                title: 'Data Subscription.',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify({...meta_data, transId: res?.requestId, status: 'success', description: res?.response_description}),
                updated_at: null,
                user: profile?.id!,
                amount: price,
                provider: 'vtpass',
            })
            setSuccessMessage(RESPONSE_CODES.TRANSACTION_SUCCESSFUL.message)

            
            toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA)}`)
            await saveCashbackHistory({amount: cashbackPrice})
            
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.get_wallet],
            })
            
            setPurchaseSuccess(true)
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            router.refresh()
        }

        else {
            setErrorMessage('An unknown error has occured, please try again.')
            await saveDataErrorHistory('An unknown error has occured, please try again.', {profiledId: profile?.id, meta_data: res ?? { ...meta_data, status: 'failed' }, price, mobile: mobileNumber})
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            return
        }
    }

    const handleVTPassAirtime = async (method: PaymentMethod, payload: VTPassAirtimePayload) => {

        const { data: wallet } = await getWallet()

        setAirtimeAmount(payload.amount.toString()!)

        const values = computeTransaction({
            payload: {
                price: (payload.amount as number),
                cashback: (payload?.cashback as number),
                method
            },
            wallet: wallet!
        })

        if (!values) return

        const {balance, cashbackBalance, cashbackPrice, deductableAmount, price} = values
        setDataBonus(cashbackPrice)

        setPurchasing(true)

        let meta_data: AirtimeDataMetadata = {
            dataQty: dataAmount ?? 0,
            duration: null,
            network: currentNetwork,
            transId: null,
            unitCashback: cashbackPrice,
            unitPrice: price,
            description: '',
            planType: null,
            phone: mobileNumber,
            status: 'success'
        }

        const res = await buyVTPassAirtime({
            ...payload,
            phone: '08011111111',
            request_id: generateRequestId()
        })

        if (!res) {
            setErrorMessage('An unknown error has occured, please try again.')
            await saveAirtimeErrorHistory('An unknown error has occured, please try again.', {profiledId: profile?.id, meta_data: {...meta_data, transId: generateRequestId(), status: 'failed',} , price, mobile: mobileNumber})
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            setPurchaseFailed(true)
            return
        }

        else if (res?.code === RESPONSE_CODES.TIME_NOT_CORRECT.code) {
            setErrorMessage(RESPONSE_CODES.TIME_NOT_CORRECT.message)
            await saveAirtimeErrorHistory(RESPONSE_CODES.TIME_NOT_CORRECT.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TIME_NOT_CORRECT.message}, price, mobile: mobileNumber})
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            return
        }

        else if (res?.code === RESPONSE_CODES.TRANSACTION_FAILED.code) {
            setErrorMessage(RESPONSE_CODES.TRANSACTION_FAILED.message)
            await saveAirtimeErrorHistory(RESPONSE_CODES.TRANSACTION_FAILED.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.TRANSACTION_FAILED.message}, price, mobile: mobileNumber})
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            return
        }

        else if (res?.code === RESPONSE_CODES.NO_PRODUCT_VARIATION.code) {
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            setErrorMessage(RESPONSE_CODES.NO_PRODUCT_VARIATION.message)
            await saveAirtimeErrorHistory(RESPONSE_CODES.NO_PRODUCT_VARIATION.message, {profiledId: profile?.id, meta_data: {...meta_data, transId: res?.requestId, status: 'failed', description: res?.response_description || RESPONSE_CODES.NO_PRODUCT_VARIATION.message}, price, mobile: mobileNumber})
            return
        }
        
        else if (res?.code === RESPONSE_CODES.TRANSACTION_SUCCESSFUL.code) {
            const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
                (balance - deductableAmount))

            const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
                (cashbackBalance))
            
                setWalletBalance(_walletBalance.balance ?? 0)

            if (_balanceError || _cashbackBalanceError) return setPurchasing(false)

            const { data: _insertHistory } = await insertTransactionHistory({
                description: `Airtime subscription topped-up for ${mobileNumber} successfully.`,
                status: 'success',
                title: 'Airtime Subscription Success.',
                type: EVENT_TYPE.data_topup,
                email: null,
                meta_data: JSON.stringify({...meta_data, transId: res?.requestId, status: 'success', description: res?.response_description}),
                updated_at: null,
                user: profile?.id!,
                amount: price,
                provider: 'vtpass',
            })
            setSuccessMessage(RESPONSE_CODES.TRANSACTION_SUCCESSFUL.message)

            
            toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA)}`)
            await saveCashbackHistory({amount: cashbackPrice})
            
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.get_wallet],
            })
            
            setPurchaseSuccess(true)
            setPurchasing(false)
            setOpenConfirmPurchaseModal(false)
            router.refresh()
        }

        else {
            setErrorMessage('An unknown error has occured, please try again.')
            await saveAirtimeErrorHistory('An unknown error has occured, please try again.', {profiledId: profile?.id, meta_data: {...meta_data, status: 'failed', transId: generateRequestId()}, price, mobile: mobileNumber})
            setPurchasing(false)
            setPurchaseFailed(true)
            setOpenConfirmPurchaseModal(false)
            return
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
