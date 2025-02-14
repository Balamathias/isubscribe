'use server'

import { Tables } from "@/types/database"
import { createClient } from "@/utils/supabase/server"
import { getUser } from "./accounts"
import { getWallet, updateCashbackBalanceByUser } from "./wallets"
import { saveCashbackHistory } from "./history"
import { headers } from "next/headers"

export const createReferral = async (payload: Partial<Tables<'referrals'>>) => {
    const supabase = createClient()
    const header = headers()
    const { data: user } = await getUser()

    const device = header.get('user-agent') || 'Unknown'
    const ip = header.get('x-real-ip') || header.get('x-forwarded-for') || 'Unknown'
    const deviceAddress = `${device}-${ip}`

    if (!user) {
        return { error: 'User not found' }
    }

    if (!payload) {
        return { error: 'Payload is empty.' }
    }

    if (payload.referrer === payload.referred) {
        return { error: 'You cannot refer yourself' }
    }

    const { data: existingReferral, error: referralError } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred', payload.referred!)
        .or(`device.eq.${deviceAddress}, ip.eq.${ip}`)
        .single()

    if (referralError && referralError.code !== 'PGRST116') { 
        return { error: referralError.message }
    }

    if (existingReferral) {
        return { error: 'Suspicious referral detected. You cannot refer the same person using different emails.' }
    }

    payload.device = deviceAddress
    payload.ip = ip

    const { data, error } = await supabase
        .from('referrals')
        .insert(payload)
        .select()
        .single()

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

    const { data, error } = await supabase.from('referrals')
        .select(`*, profile!referrals_referred_fkey (full_name, id, avatar, email)`)
        .eq('referrer', payload.id)
        .order('created_at', { ascending: false })
        .order('updated_at', { ascending: false, nullsFirst: false })
        .limit(25)

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    console.log(data)

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

export const claimReferralBonus = async (payload: { id: string }) => {
    const supabase = createClient()
    const { data: wallet } = await getWallet()

    const { data, error } = await supabase.from('referrals').update({ status: 'claimed' }).eq('id', payload.id).select().single()

    const finalBonus = Math.max(wallet?.cashback_balance! + data?.reward!, 0)

    if (error) {
        return { error: error.message }
    }

    if (!data) {
        return { error: 'Referral bonus not found, perhaps you might have already claimed it.' }
    }

    if (data?.status !== 'claimed') {
        return { error: 'Referral bonus already claimed' }
    }

    if (finalBonus <= 0) {
        return { error: 'Invalid cashback balance' }
    }

    await Promise.all([
        updateCashbackBalanceByUser(wallet?.user!, finalBonus),
        saveCashbackHistory({ amount: data?.reward!, title: 'Referral Bonus' })
    ])

    return { data: data || null, error: error || null }
}