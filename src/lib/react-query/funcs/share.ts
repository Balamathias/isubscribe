import { claimReferralBonus, createReferral, getUserReferrals } from "@/lib/supabase/share"

import { Tables } from "@/types/database"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export enum KEYS {
    createReferral = 'createReferral',
    getUserReferrals = 'getUserReferrals',
    claimReferralBonus = 'claimReferralBonus',
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

export const useClaimReferralBonus = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [KEYS.claimReferralBonus],
        mutationFn: async (id: string) => claimReferralBonus({ id }),
        onSuccess: (data) => {
          if (data?.error) {
            throw new Error(data.error)
          }
          
          toast.success('Referral bonus claimed successfully')
          router.refresh()
        },
        onError: (error: any) => {
          toast.error(error.message)
        }
    })
}