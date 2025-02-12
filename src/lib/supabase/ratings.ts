'use server'

import { createClient } from '@/utils/supabase/server'

export const getRatings = async (limit=10) => {
  const supabase = createClient()
  const { data, error } = await supabase.from('ratings')
  .select('*, profile (full_name, email, avatar)')
  .order('created_at', { ascending: false })
  .eq('status', 'published')
  .limit(limit)

  if (error) {
    console.error(error)
    return null
  }
  return { data }
}
