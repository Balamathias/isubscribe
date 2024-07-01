"use server"

import { Tables } from "@/types/database"
import { createClient } from "../../utils/supabase/server"
import { getUser } from "./accounts"

export const setPassPin = async ({pin, phone}: Pick<Tables<'profile'>, 'pin'> & { phone?: string }) => {
    const supabase = createClient()

    const { data: profile } = await getUser()
    const userId = profile?.id

    const { data, error } = await supabase.from('profile')
    .update({
        pin,
        phone,
        updated_at: new Date().toISOString(),
        onboarded: true,
     })
     .eq('id', userId!)
    .select()
    .single()

    if (error) throw error
        
}