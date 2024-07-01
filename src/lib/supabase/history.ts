'use server'

import { createClient } from "@/utils/supabase/server"
import { getUser } from "./accounts"

export const getTransactionHistory = async () => {
    const supabase = createClient()

    const { data: user } = await getUser()

    const { data, error } = await supabase.from('history')
    .select('*')
    .eq('user', user?.id!)
    .order('created_at', { ascending: false })

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