
import { supabaseURL } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseURL!, serviceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const adminAuthClient = supabase.auth.admin