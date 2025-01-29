'use server'

import { Tables } from "@/types/database"
import { createClient } from "@/utils/supabase/server"
import { getUser } from "./accounts"

export const createReferral = async (payload: Partial<Tables<'referrals'>>) => {
    const supabase = createClient()

    const { data: user } = await getUser()

    if (!user) {
        return { error: 'User not found' }
    }

    if (payload.referrer === payload.referred) {
        return { error: 'You cannot refer yourself' }
    }

    const { data, error } = await supabase.from('referrals').insert(payload).select().single()

    if (error) {
        return { error: error.message }
    }

    return { data: data || null, error: error || null }
}

export const getReferral = async (payload: { id: string }) => {
    const supabase = createClient()

    const { data, error } = await supabase.from('referrals').select().eq('email', payload.id).single()

    if (error) {
        return { error: error.message }
    }

    return { data: data || null, error: error || null }
}

export const getUserReferrals = async (payload: { id: string }) => {
    const supabase = createClient()

    const { data, error } = await supabase.from('referrals').select().eq('referral', payload.id)

    if (error) {
        return { error: error.message }
    }

    return { data: data || null, error: error || null }
}

export const updateReferral = async (payload: { id: string, data: Partial<Tables<'referrals'>> }) => {
    const supabase = createClient()

    const { data, error } = await supabase.from('referrals').update(payload.data).eq('email', payload.id).single()

    if (error) {
        return { error: error.message }
    }

    return { data: data || null, error: error || null }
}