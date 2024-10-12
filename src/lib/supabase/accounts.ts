'use server'

import { Tables } from "@/types/database";
import { createClient } from "@/utils/supabase/server";
import { nanoid } from "nanoid";
import { getCurrentUser } from "./user.actions";
import { handleInvitation, upsertWallet } from "./wallets";
import { getReservedAccount } from "../monnify/actions";

export const getAccount = async (id?: string) => {
    const { data: { user } } = await getCurrentUser()
    const supabase = createClient()
    const { data, error } = await supabase.from('account').select('*').eq('user', id ?? user?.id!).single()

    if (error) throw error

    return { data, error }
}

export const generateReservedAccount = async () => {
    const supabase = createClient()

    const { data: user, error } = await getUser()

    const reservedAccount = await getReservedAccount({
        accountReference: nanoid(24),
        accountName: user?.full_name!,
        currencyCode: 'NGN',
        contractCode: process.env.NEXT_MONNIFY_CONTRACT_CODE!,
        customerEmail: user?.email!,
        customerName: user?.full_name!,
        getAllAvailableBanks: true,
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
        }).single()
        if (error) throw error

        return { data, error }

    } else return {data: null, error }
}

export const deleteReservedAccount = async (id: string) => {
    const supabase = createClient()
    const { status, error } = await supabase.from('account').delete().eq('id', id).single()

    if (error) throw error

    return { status, error }
}

export const getUser = async (id?: string) => {
    const supabase = createClient()
    let ID;
    if (id) {
        ID = id
    } else {
        const { data: { user } } = await getCurrentUser()
        ID = user?.id
    }
    if (!ID) return { data: null, error: new Error('User not found') }

    const { data, error } = await supabase.from('profile').select('*').eq('id', ID).single()

    if (error) throw error

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

