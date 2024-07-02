'use server'

import { createClient } from "@/utils/supabase/server"
import { getCurrentUser } from "./user.actions";
import { getUser } from "./accounts";

export const getWallet = async (userId?: string) => {
    const supabase = createClient()
    let ID;
    if (userId) {
        ID = userId
    } else {
        const { data: { user } } = await getCurrentUser()
        ID = user?.id
    }
    if (!ID) return { data: null, error: null }

    const { data, error } = await supabase.from('wallet').select('*').eq('user', ID).single()

    if (!data?.id) {
        const {data, error} = await upsertWallet({ user: ID, balance: 0 })
        if (error) return { data: null, error }
        return { data, error }
    }

    if (error) throw error

    return { data, error }
}

export const upsertWallet = async ({id, user: userId, ...rest}: {id?: number, user?: string, balance?: number, cashback_balance?: number}) => {
    const supabase = createClient()
    let ID;
    if (userId) {
        ID = userId
    } else {
        const { data: { user } } = await getCurrentUser()
        ID = user?.id
    }
    if (!ID) return { data: null, error: new Error('User not found') }

    if (id) {
        const { data, error } = await supabase.from('wallet').select('*').eq('id', id).single()
        if (error) return { data: null, error }
        if (data) return { data, error: {message: 'Wallet already exists'}}
    }

    const { data, error } = await supabase.from('wallet').upsert({
        id,
        ...rest,
        user: ID,
        updated_at: new Date().toISOString(),
    })

    if (error) console.error(error)

    return { data, error }
}

export const updateWalletBalance = async (id: number, balance: number) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('wallet').update({balance, bonus_claimed: true}).eq('id', id).select()
    if (error) throw error
    return { data, error }
}

export const updateWalletBalanceByUser = async (userId: string, balance: number) => {
    const supabase = createClient()
    const { data, error } = await supabase.from('wallet').update({balance, bonus_claimed: true}).eq('user', userId).select()
    if (error) throw error
    return { data, error }
}

export const handleInvitation = async (invitationId: string, bonus=100) => {
    const supabase = createClient()
    const { data: user } = await getUser()
    const { data, error } = await supabase.from('profile').select().eq('unique_code', invitationId).single()
    if (error) throw error
    const { data: _walletBalance } = await supabase.from('wallet').select().eq('user', data.id).single()
    if (data) {
        const { error: _walletError } = await supabase.from('wallet').update({balance: parseFloat(_walletBalance?.balance?.toString() || '0') + bonus}).eq('user', data.id)
        if (_walletError) throw _walletError
        const { error: _historyError, status } = await supabase.from('history').insert({
            type: 'bonus', 
            user: data.id, 
            title: 'Invitation bonus',
            description: `You received a bonus of N${bonus} for inviting ${user?.email}`,
            meta_data: JSON.stringify({
            amount: bonus,
            invitee_id: user?.id,
        })}).eq('user', data.id)

        if (_historyError) throw _historyError

        if (error) throw error
        return { data, error, status }
    }

    const experimental_str = `const response = await getWallet()
    if (response.error) throw response.error
    const { data: _wallet, error: _walletError } = await supabase.from('wallets').upsert({
        user: user?.id,
        balance: parseFloat(response?.data?.balance?.toString() || '0') + bonus
        })
    if (_walletError) throw _walletError
    const { data: _history, error: _historyError, status } = await supabase.from('history').insert({
        type: 'welcome_bonus', 
        user: user?.id, 
        title: 'Invitation bonus',
        description: \`You received a welcome bonus of N${bonus} for signing up at SubMe\`,
        meta_data: JSON.stringify({
            amount: bonus,
            invitee_id: user?.id,
        })
    })
    if (_historyError) throw _historyError`

    return { data, error }
}