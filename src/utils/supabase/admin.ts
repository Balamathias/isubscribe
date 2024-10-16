
import { supabaseURL } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseURL!, serviceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default supabaseAdmin