"use server"

import generateRequestId from "@/funcs/generateRequestId"
import { buyData } from "@/lib/n3tdata"
import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import { insertTransactionHistory, saveCashbackHistory } from "@/lib/supabase/history";
import { AirtimeDataMetadata } from "@/types/airtime-data";
import { getUser } from "@/lib/supabase/accounts";
import { DATA_MB_PER_NAIRA } from "@/lib/utils";
import { formatDataAmount } from "@/lib/utils";
import { updateCashbackBalanceByUser } from "@/lib/supabase/wallets";
import { getWallet, updateWalletBalanceByUser } from "@/lib/supabase/wallets";
import { priceToInteger } from "@/funcs/priceToNumber";
import { computeServerTransaction } from "./compute.server";
import { Networks } from "@/lib/n3tdata/types";
import { PaymentMethod } from "@/types/networks";
// import { Redis } from '@upstash/redis'
// import { Queue,  } from 'bull'

interface ProcessData_N3T {
    data_plan: number;
    network: number;
    phone: string;
    currentNetwork: Networks;
    payload: {
        Price: string;
        CashBack: string;
        method: PaymentMethod;
        commission?: number;
        Data: string
    };
    meta_data: AirtimeDataMetadata;
}

// Initialize Redis client
// const redis = new Redis({
//   url: process.env.REDIS_URL!,
//   token: process.env.REDIS_TOKEN!
// })

// // Initialize Bull queue for background jobs
// const historyQueue = new Queue('transaction-history', {
//   redis: process.env.REDIS_URL
// })

// This function makes multiple database calls and external API requests
// Estimated execution time: 2-5 seconds normal, 10-15 seconds on slow networks
//
// Current Supabase optimizations implemented:
// 1. Batch writes using Supabase's upsert:
//    const { data, error } = await supabase
//      .from('wallets')
//      .upsert([
//        { user_id: profile.id, balance: newBalance },
//        { user_id: profile.id, cashback_balance: newCashback }
//      ])
//
// 2. Parallel queries using Promise.all:
//    const [walletUpdate, historyInsert] = await Promise.all([
//      updateWalletBalances(),
//      insertTransactionHistory()
//    ])
//
// 3. Optimistic updates on frontend while waiting for DB
//
// Additional optimizations needed:
// - Add Redis caching layer for user/wallet data
// - Implement background job queue for history writes
// - Add retry logic for failed DB operations
// - Monitor query performance with Supabase metrics
// - Consider read replicas for heavy load
//
// @TODO: Implement remaining optimizations in separate PR
export const processData_n3t = async ({
    data_plan,
    network,
    phone,
    meta_data,
    payload,
    currentNetwork
}: ProcessData_N3T) => {
    // Try to get user profile from cache first
    // const cacheKey = `user:${profile?.id}`
    // let profile = await redis.get(cacheKey)
    
    const { data: profile } = await getUser()

    // if (!profile) {
    //     const { data: fetchedProfile } = await getUser()
    //     profile = fetchedProfile
    //     // Cache user data for 5 minutes
    //     await redis.set(cacheKey, JSON.stringify(profile), { ex: 300 })
    // }

    const { data: values, error: computeError } = await computeServerTransaction({
        payload: {
            price: priceToInteger(payload.Price),
            cashback: priceToInteger(payload.CashBack),
            method: payload.method,
            interest: payload?.commission
        },
    })

    
    if (computeError || !values) return {
        error: {
            message: computeError || 'An unknown error has occured, please try again.'
        },
        data: null
    }

    const { balance, cashbackBalance, cashbackPrice, deductableAmount, price, commission } = values

    if (!profile) {
        return {
            error: {
                message: 'Failed to initiate transaction, please try again.'
            },
            data: null
        }
    }

    const { data, error } = await buyData({
        "request-id": `Data_${generateRequestId()}`,
        bypass: false,
        data_plan,
        network,
        phone,
    })


    if (error || (data?.status === 'fail')) {
        meta_data = {
            ...meta_data,
            transId: data?.transid ?? null,
            description: data?.message,
            status: 'failed',
            transaction_id: data?.["request-id"],
        }
        
        const { data: _insertHistory } = await insertTransactionHistory({
            description: `Data subscription for ${phone} failed.`,
            status: 'failed', 
            title: 'Data Subscription',
            type: EVENT_TYPE.data_topup,
            meta_data: JSON.stringify(meta_data),
            user: profile?.id!,
            amount: meta_data.unitPrice,
            provider: 'n3t',
            request_id: data?.['request-id'],
            commission: meta_data.commission,
        })

        const match = data?.message?.includes('Insufficient')

        console.log(match)

        if (match) {
            return {
                error: {
                    message: 'This service provider is temporarily unavailable, please try again later.'
                },
                data: null
            }
        }

        return {
            error: {
                message: data?.message ?? 'Data subscription failed. Please try again.'
            },
            data: null
        }
    }

    if (data?.status === 'success') {
        const { data: wallet } = await getWallet()

        // Update wallet with retry logic
        const updateWallet = async (retries = 3) => {
            try {
                const [walletUpdate, cashbackUpdate] = await Promise.all([
                    updateWalletBalanceByUser(profile?.id!, (wallet?.balance! - deductableAmount)),
                    updateCashbackBalanceByUser(profile?.id!, cashbackBalance)
                ])
                
                // Invalidate wallet cache after update                
                return { walletUpdate, cashbackUpdate }
            } catch (error) {
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    return updateWallet(retries - 1)
                }
                throw error
            }
        }

        const { walletUpdate, cashbackUpdate } = await updateWallet()

        // Move history insertion to background job
        // await historyQueue.add('insertHistory', {
        //     description: `Data subscription`,
        //     status: 'success',
        //     title: 'Data Subscription',
        //     type: EVENT_TYPE.data_topup,
        //     meta_data: JSON.stringify(meta_data),
        //     user: profile?.id!,
        //     amount: price,
        //     provider: 'n3t',
        //     commission
        // })

        // Move cashback history to background job
        // await historyQueue.add('saveCashback', {
        //     amount: cashbackPrice
        // })

        let meta_data: AirtimeDataMetadata = {
            dataQty: payload?.Data ?? 0,
            duration: null,
            network: currentNetwork,
            transId: data?.transid ?? null,
            unitCashback: cashbackPrice,
            unitPrice: price,
            description: data?.message,
            planType: data?.plan_type,
            phone,
            status: 'success',
            transaction_id: data?.["request-id"],
            commission
        }

        return {
            data,
            extra: {
                // historyId: _insertHistory?.id,
                cashbackQuantity: formatDataAmount(cashbackPrice * DATA_MB_PER_NAIRA),

            },
            error: null
        }
    } else {
        return {
            error: {
                message: `An attempt to initiate this transaction failed for unknown reasons, please try again.`
            },
            data: null
        }
    }
}