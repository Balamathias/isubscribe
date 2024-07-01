import { Database } from '@/types/database'
import { supabaseKey, supabaseURL } from '@/lib/supabase'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient<Database>(
    supabaseURL!,
    supabaseKey!
  )
}