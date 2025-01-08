import { getSavedBeneficiaries, saveBeneficiary } from "@/lib/supabase/beneficiaries"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export const useBeneficiaries = (limit?: number) => {

    return useQuery({
        queryKey: ['benefiaries'],
        queryFn: async () => getSavedBeneficiaries(limit)
    })
}

export const useInsertBeneficiary = () => {
    
    const router = useRouter()

    return useMutation({
        mutationFn: saveBeneficiary,
        mutationKey: ['beneficiary'],
        onSuccess: () => {
            router.refresh()
        }
    })
}