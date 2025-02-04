import { sendMoney } from "@/actions/transfer"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useSendMoney = () => {
    const router = useRouter()
    return useMutation({
        mutationKey: ['send-money'],
        mutationFn: async (payload: { amount: number, accountNumber: string }) => sendMoney(payload),
        onSuccess: (data) => {
            if (data?.error) {
                throw new Error(data.error)
            }
            router.refresh()
        },
        onError: (error) => {
            console.error(error)
            toast.error(error.message)
        }
    })
}