'use server'

import { createClient } from "@/utils/supabase/server"
import { getAccount } from "../supabase/accounts"
import { redis } from "../redis"
import { Tables } from "@/types/database";

const ONE_DAY_IN_SECONDS = 5 * 24 * 60 * 60; // 1 day in seconds

export async function searchAccounts(query: string): Promise<{ data: (Tables<'account'> & { profile: Tables<'profile'> | null })[] | null, error: string | null }> {
  if (!query || query.length < 3) {
    return { data: null, error: null }
  }

  const supabase = createClient()

  const { data: account } = await getAccount()

  if (account?.account_number === query) {
    return { data: null, error: `You cannot transfer to yourself` }
  }

  try {
    const cachedResult = await redis.get<(Tables<'account'> & { profile: Tables<'profile'> | null })[] | null>(query);
    if (cachedResult) {
      console.log("cached result", cachedResult)
      return { data: cachedResult, error: null };
    }

    const { data, error } = await supabase
      .from('account')
      .select(`*, profile (*)`)
      .eq('account_number', query)

    if (error) {
      return { data: null, error: error.message }
    }

    await redis.set(query, (data), { ex: ONE_DAY_IN_SECONDS });

    return { data: data, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to search accounts' }
  }
}