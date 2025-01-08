'use server'

import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/lib/supabase/accounts'
import { redis } from '../redis'

export const saveBeneficiary = async (phone: string) => {
    const supabase = createClient()

    const { data: user } = await getUser()

    const { data, error } = await supabase.from('beneficiaries')
        .insert({
            phone,
            last_used: new Date().toISOString(),
            user: user?.id
        })
        .select('phone')

    return { error, data }
}

export const getSavedBeneficiaries = async (limit=5): Promise<string[] | undefined> => {
    const supabase = createClient()
    const { data: user } = await getUser()

    if (!user) return

    const cacheKey = `beneficiaries:${user?.id}`

    try {
        const phones = await redis.get<string[]>(cacheKey)

        if (phones) return phones
    } catch (error) {
        console.error(error)
    }

    const { data, error } = await supabase.from('beneficiaries')
        .select('phone')
        .eq('user', user?.id)
        .order("last_used", { ascending: false })
        .order("frequency", { ascending: false })
        .limit(limit)

    try {
        await redis.set(cacheKey, data?.map(phone => phone.phone), { ex: 300 })
    } catch (error) {
        console.error(error)
    }

    const phones = data?.map(phone => phone.phone ? phone.phone : '')

    return phones
}