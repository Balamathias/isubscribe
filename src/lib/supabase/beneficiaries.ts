'use server'

import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/lib/supabase/accounts'
import { redis } from '../redis'

export const saveBeneficiary = async (phone: string) => {
    const supabase = createClient()

    const { data: user, error: userError } = await getUser();

    if (userError || !user) {
        return { error: userError || 'User not found', data: null };
    }

    const { data: beneficiaries, error: fetchError } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('user', user.id)
        .order('last_used', { ascending: true });

    if (fetchError) {
        throw fetchError;
    }

    if (beneficiaries.length >= 10) {
        const oldestBeneficiaryId = beneficiaries[0].id;
        const { error: deleteError } = await supabase.from('beneficiaries').delete().eq('id', oldestBeneficiaryId);

        if (deleteError) {
            throw deleteError;
        }
    }

    const { data, error } = await supabase
        .from('beneficiaries')
        // @ts-expect-error Nothing is really going to go wrong.
        .upsert(
        {
            phone: phone,
            last_used: new Date().toISOString(),
            user: user.id,
        },
        { onConflict: ['user', 'phone'] }
        )
        .select('phone, last_used');

    return { error, data };
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
        await redis.set(cacheKey, data?.map(phone => phone.phone), { ex: 30 })
    } catch (error) {
        console.error(error)
    }

    const phones = data?.map(phone => phone.phone ? phone.phone : '')

    return phones
}