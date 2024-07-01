'use server'

import { createClient } from "@/utils/supabase/server"

export const getTransactionHistory = async () => {
    const supabase = createClient()

    const { data, error } = await supabase.from('history')
    .select('*')
    .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return { data }
}