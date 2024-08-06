'use server'

import { createClient } from "@/utils/supabase/server"
import { getUser } from "./accounts"
import { Tables } from "@/types/database"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { formatNigerianNaira } from "@/funcs/formatCurrency"

export const getTransactionHistory = async () => {
    const supabase = createClient()

    const { data: user } = await getUser()

    const { data, error } = await supabase.from('history')
    .select('*')
    .eq('user', user?.id!)
    .order('created_at', { ascending: false })
    .limit(25)

    if (error) {
        throw error
    }

    return { data }
}

export const getSingleHistory = async (id: number) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('history')
        .select('*')
        .eq('id', id)
        .single()
    
    if (error) throw error

    return { data, error }
}

export const insertTransactionHistory = async ({...rest}: Omit<Tables<'history'>, 'id' | 'created_at'>) => {
    const supabase = createClient()
    const { data: user } = await getUser()

    const { data, error } = await supabase.from('history')
        .insert({
            ...rest,
            user: user?.id!,
        })

    if (error) {
        throw error
    }

    return { data }
}

export const saveDataErrorHistory = async (msg: string, data: Record<string, any>) => {
    const { data: _insertHistory } = await insertTransactionHistory({
        description: `Data subscription for ${data?.mobile} failed. ${msg}`,
        status: 'failed',
        title: 'Data Subscription Failed.',
        type: EVENT_TYPE.data_topup,
        email: null,
        meta_data: JSON.stringify(data?.meta_data),
        updated_at: null,
        user: data?.profileId,
        amount: data?.price
    })
}

export const saveCashbackHistory = async ({amount, ...rest}: {
    amount: number,
}) => {
    const { data: user } = await getUser()

    const { data: _insertHistory } = await insertTransactionHistory({
        description: `You have successfully received a cashback of ${formatNigerianNaira(amount)}.`,
        status: 'success',
        title: 'Cashback',
        type: EVENT_TYPE.cashback,
        email: null,
        meta_data: JSON.stringify({
            cashback: amount,
            ...rest
        }),
        updated_at: null,
        user: user?.id!,
        amount: amount
    })
}

export const insertDataPurchaseFailedHistory = async ({}) => {
    const supabase = createClient()
    const { data: user } = await getUser()

    const { data, error } = await supabase.from('history')
        .insert({})

    if (error) throw error
}