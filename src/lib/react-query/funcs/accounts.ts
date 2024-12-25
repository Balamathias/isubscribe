import { generateReservedAccount } from "@/lib/supabase/accounts";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useGenerateAcount = () => {
    const router = useRouter()
    return useMutation({
        mutationKey: ['generate_reserved_account'],
        mutationFn: generateReservedAccount,
        onSuccess: (data) => {
            if (!data?.error) {
                router.refresh()
                toast.success("Reserved account generated successfully.")
            } else {
                throw new Error(data?.error?.message)
            }
        },
        onError: (err) => {
            toast.error("Error generating account!", { description: err?.message })
        }
    })
}