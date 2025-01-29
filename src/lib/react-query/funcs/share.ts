import { createReferral, getUserReferrals } from "@/lib/supabase/share"

import { Tables } from "@/types/database"
import { useMutation, useQuery } from "@tanstack/react-query"

export enum KEYS {
    createReferral = 'createReferral',
    getUserReferrals = 'getUserReferrals',
}

export const useCreateReferral = () => {
  return useMutation({
    mutationKey: [KEYS.createReferral],
    mutationFn: async (payload: Partial<Tables<'referrals'>>) => createReferral(payload),
  })
}

export const useGetUserReferrals = (id: string) => {
    return useQuery({
        queryKey: [KEYS.getUserReferrals, id],
        queryFn: async () => getUserReferrals({ id }),
    })
}