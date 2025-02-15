'use server'

import { Tables } from "@/types/database";
import { createClient } from "@/utils/supabase/server";
import { nanoid } from "nanoid";
import { getCurrentUser } from "./user.actions";
import { upsertWallet } from "./wallets";
import { deallocateAccount, getReservedAccount } from "../monnify/actions";
import { redis } from '../redis'

const generateReference = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    return Array.from(
        { length: 10 },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
};

export const getAccount = async (id?: string) => {
    const { data: { user } } = await getCurrentUser()
    const supabase = createClient()
    const { data, error } = await supabase.from('account').select('*').eq('user', id ?? user?.id!).single()

    if (error) return { data, error }

    return { data, error }
}

export const generateReservedAccount = async (req?:{ bvn?: string, nin?: string }) => {
    const supabase = createClient()

    try {
        const { data: user, error } = await getUser()

        const reservedAccount = await getReservedAccount({
            accountReference: nanoid(24),
            accountName: user?.full_name!,
            currencyCode: "NGN",
            contractCode: process.env.NEXT_MONNIFY_CONTRACT_CODE!,
            customerEmail: user?.email!,
            customerName: user?.full_name!,
            getAllAvailableBanks: false,
            nin: req?.nin,
            bvn: req?.bvn
        })

        const body = reservedAccount?.responseBody
        const successful = reservedAccount?.requestSuccessful

        if (successful) {
            const { data, error } = await supabase.from('account').insert({
                account_name: body?.accountName,
                account_number: body?.accountNumber,
                bank_name: body?.bankName,
                bank_code: body?.bankCode,
                user: user?.id!,
                reference: body?.accountReference,
                status: body?.status,
                updated_at: new Date().toISOString(),
            }).select().single()
            
            if (error) {
                return { data, error }
            }

            return { data, error }

        } else {
            return {
                data: null, 
                error: { 
                    message: `Account generation failed, please double-check your ${req?.bvn ? "BVN" : req?.nin ? "NIN" : ""}.` 
                }
            }
        }
    } catch (error: any) {
        return {
            data: null,
            error: {
                message: error?.message
            }
        }
    }
}

export const deAlloc = async () => {

    const references: string[] = [
            
    ];
      
    
    references.map(async (acc) => await deallocateAccount(acc!))
    console.log(references)
}

export const deleteReservedAccount = async (id: string) => {
    const supabase = createClient()

    const { data: account } = await supabase.from('account').select("reference").eq("id", id).single()
    
    if (account?.reference) {
        await deallocateAccount(account?.reference)
        const { status, error } = await supabase.from('account').delete().eq('id', id).single()
    }
}

export const getUser = async (id?: string, useCache: boolean = false) => {
    const supabase = createClient()
    let ID;
    if (id) {
        ID = id
    } else {
        const { data: { user } } = await getCurrentUser()
        ID = user?.id
    }
    if (!ID) return { data: null, error: ('User not found') }

    if (useCache) {
        const cacheKey = `user:${ID}`
        try {
            const cachedUser = await redis.get<Tables<'profile'>>(cacheKey)
            if (cachedUser) {
                return { data: cachedUser, error: null }
            }
        } catch (error) {
            console.error('Redis cache error:', error)
        }
    }

    const { data, error } = await supabase.from('profile').select('*').eq('id', ID).single()

    if (error) return { error, data }

    if (useCache && data) {
        try {
            const cacheKey = `user:${ID}`
            await redis.set(cacheKey, JSON.stringify(data), { ex: 300 })
        } catch (error) {
            console.error('Redis cache set error:', error)
        }
    }

    return { data, error }
}

export const upsertUser = async ({id, ...rest}: Pick<Tables<'profile'>, 'state' | 'email' | 'full_name' | 'id' | 'phone' | 'pin'>) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('profile').upsert({
        id,
        updated_at: new Date().toISOString(),
        onboarded: true,
        unique_code: nanoid(10),
        ...rest,
    }).select().single()

    const { data: getWallet } = await supabase.from('wallet').select('*').eq('user', id).single()
    if (!(getWallet?.user === id)) {
        const { error: walletError } = await upsertWallet({
            user: id,
            balance: 0,
        })

        if (walletError) {
            console.error(walletError)
        }
    }

    if (error) throw error
    return { data, error }
}

export const updateSecurityQuestion = async ({ security_answer, security_question}: {security_answer: string, security_question: string}) => {
    const supabase = createClient()
    const user = await getCurrentUser()
    const { error } = await supabase.from('profile').update({
        security_answer,
        security_question
    }).eq('id', user?.data?.user?.id!)

    if (error) {
        console.error(error)
    }
}

