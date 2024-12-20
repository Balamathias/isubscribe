// import { priceToInteger } from '@/funcs/priceToNumber'
// import { computeServerTransaction } from '@/actions/compute.server'
// import { PaymentMethod, SubDataProps } from '@/types/networks'
// import { toast } from 'sonner'
// import { useMutation } from '@tanstack/react-query'
// import { networkIds } from '@/utils/networks'
// import { AirtimeDataMetadata } from '@/types/airtime-data'
// import { buyData } from '@/lib/n3tdata'
// import { insertTransactionHistory, saveCashbackHistory } from '@/lib/supabase/history'
// import generateRequestId from '@/funcs/generateRequestId'
// import { useNetwork } from '@/providers/data/sub-data-provider'
// import { EVENT_TYPE } from '@/utils/constants/EVENTS'
// import { getUser } from '@/lib/supabase/accounts'
// import { updateCashbackBalanceByUser } from '@/lib/supabase/wallets'
// import { updateWalletBalanceByUser } from '@/lib/supabase/wallets'
// import { DATA_MB_PER_NAIRA } from '@/lib/utils'
// import { formatDataAmount } from '@/lib/utils'
// import { QueryKeys } from '../query-keys'

// export const useN3TData = () => {

//   const { currentNetwork, mobileNumber } = useNetwork()

//   return useMutation({
//     mutationKey: ['use-n3t-sub'],
//     mutationFn: async (payload: SubDataProps & { method?: PaymentMethod }) => {

//         // setDataAmount(payload.Data)
//         const { data: profile } = await getUser()

//         const { data: values, error: computeError } = await computeServerTransaction({
//             payload: {
//                 price: priceToInteger(payload.Price),
//                 cashback: priceToInteger(payload.CashBack),
//                 method: payload.method,
//                 interest: payload?.commission
//             },
//         })

//         if (computeError || !values) throw new Error(computeError || 'An unknown error has occured, please try again.')

//         const {balance, cashbackBalance, cashbackPrice, deductableAmount, price, commission} = values
//         // setDataBonus(cashbackPrice)

//         const networkId = networkIds[currentNetwork]
//         // setPurchasing(true)

//         const { data, error } = await buyData({
//             "request-id": `Data_${generateRequestId()}`,
//             bypass: false,
//             data_plan: payload.Plan_ID,
//             network: networkId,
//             phone: mobileNumber
//         })

//         /** if (error) return, @example: You could uncomment this only in edge cases */

//         if (error || (data?.status === 'fail')) {
            
//             let meta_data: AirtimeDataMetadata = {
//                 dataQty: payload?.Data ?? '0',
//                 duration: null,
//                 network: currentNetwork,
//                 transId: data?.transid ?? null,
//                 unitCashback: cashbackPrice,
//                 unitPrice: price,
//                 description: data?.message,
//                 planType: data?.plan_type!,
//                 phone: mobileNumber,
//                 status: 'failed',
//                 transaction_id: data?.["request-id"],
//                 commission: 0
//             }
            
//             const { data: _insertHistory } = await insertTransactionHistory({
//                 description: `Data subscription for ${mobileNumber} failed.`,
//                 status: 'failed',
//                 title: 'Data Subscription',
//                 type: EVENT_TYPE.data_topup,
//                 meta_data: JSON.stringify(meta_data),
//                 user: profile?.id!,
//                 amount: price,
//                 provider: 'n3t',
//                 request_id: data?.['request-id'],
//                 commission: 0,
//             })

//             // setPurchasing(false)
//             // setOpenConfirmPurchaseModal(false)
//             // setPurchaseFailed(true)

//             const match = data?.message?.includes('Insufficient')


//             if (match) {
//                 return setErrorMessage('This service provider is temporarily unavailable, please try again later.')
//             }

//             setErrorMessage(data?.message ?? 'Data subscription failed. Please try again.')

//             router.refresh()
//             return
//         }

//         if (data?.status === 'success') {
            
//             const { data: _walletBalance, error:_balanceError } = await updateWalletBalanceByUser(profile?.id!, 
//                 (balance - deductableAmount))

//             setWalletBalance(_walletBalance.balance ?? 0)

//             const { data: _cashbackBalance, error:_cashbackBalanceError } = await updateCashbackBalanceByUser(profile?.id!, 
//                 (cashbackBalance))

//             if (_balanceError || _cashbackBalanceError) return setPurchasing(false)

//             let meta_data: AirtimeDataMetadata = {
//                 dataQty: payload?.Data ?? 0,
//                 duration: null,
//                 network: currentNetwork,
//                 transId: data?.transid ?? null,
//                 unitCashback: cashbackPrice,
//                 unitPrice: price,
//                 description: data?.message,
//                 planType: data?.plan_type,
//                 phone: mobileNumber,
//                 status: 'success',
//                 transaction_id: data?.["request-id"],
//                 commission
//             }

//             const { data: _insertHistory } = await insertTransactionHistory({
//                 description: `Data subscription`,
//                 status: 'success',
//                 title: 'Data Subscription',
//                 type: EVENT_TYPE.data_topup,
//                 email: null,
//                 meta_data: JSON.stringify(meta_data),
//                 updated_at: null,
//                 user: profile?.id!,
//                 amount: price,
//                 provider: 'n3t',
//                 commission
//             })
//             setSuccessMessage(data?.message ?? 'Data subscription successful. Thank you for choosing iSubscribe.')
//             setHistoryId(_insertHistory.id)

//             router.refresh()
//             toast.info(`Congratulations! You have received a data bonus of ${formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA)}`)
//             vibrate('success')
//             await saveCashbackHistory({amount: cashbackPrice})

//             /** 
//              * @example: toast.success(`Congratulations!`, {
//             description: `You have successfully topped-up ${payload.Data} for ${mobileNumber}`
//             })
//             */
//             queryClient.invalidateQueries({
//                 queryKey: [QueryKeys.get_wallet]
//             })
            
//            setPurchasing(false)
//            setOpenConfirmPurchaseModal(false)
//            setPurchaseSuccess(true)
//         } else {
//             /** @example: toast.error('Sorry, something went wrong! Top up failed. You may wish to try again.') */
//             setPurchasing(false)
//             setOpenConfirmPurchaseModal(false)
//             setPurchaseFailed(true)
//         }
//     }
//   })
// }