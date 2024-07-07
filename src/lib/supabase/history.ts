'use server'

import { createClient } from "@/utils/supabase/server"
import { getUser } from "./accounts"
import { Tables } from "@/types/database"

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

export const insertTransactionHistory = async ({description, meta_data, title, type, status, ...rest}: Omit<Tables<'history'>, 'id' | 'created_at'>) => {
    const supabase = createClient()
    const { data: user } = await getUser()

    const { data, error } = await supabase.from('history')
        .insert({
            ...rest,
            user: user?.id!,
            description,
            meta_data,
            status,
            title,
            type,
        })

    if (error) {
        throw error
    }

    return { data }
}