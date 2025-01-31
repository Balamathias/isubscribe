'use server'

import { createClient } from "@/utils/supabase/server"
import { Tables } from "@/types/database"
import { getAccount } from "../supabase/accounts"

export async function searchAccounts(query: string) {
  if (!query || query.length < 3) {
    return { data: null, error: null }
  }

  const supabase = createClient()

  const { data: account } = await getAccount()

  if (account?.account_number === query) {
    return { data: null, error: `You cannot transfer to yourself` }
  }

  try {
    const { data, error } = await supabase
      .from('account')
      .select(`*, profile (*)`)
      .eq('account_number', query)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to search accounts' }
  }
} 