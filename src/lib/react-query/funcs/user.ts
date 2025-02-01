import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import { setPassPin } from "@/lib/supabase/pass-pin";
import { getUser, updateSecurityQuestion } from "@/lib/supabase/accounts";
import { updateUniqueCode, validateResetPasswordOTP } from "@/lib/supabase/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSetPassPin = () => useMutation({
    mutationKey: [QueryKeys.set_pass_pin],
    mutationFn: ({pin, ...rest}: {pin: string, phone?: string}) => setPassPin({pin, ...rest}),
})

export const useSetSecurityQ = () => useMutation({
    mutationKey: [QueryKeys.sq],
    mutationFn: (data: {security_answer: string, security_question: string}) => updateSecurityQuestion(data),
})

export const useGetProfile = (id?: string, useCache?: boolean) => useQuery({
    queryKey: [QueryKeys.get_user, id, useCache],
    queryFn: () => getUser(id, useCache),
})

export const useValidateResetPassword = () => {

    const router = useRouter()

    return useMutation({
        mutationKey: ['reset-password'],
        mutationFn: ({ token, email }: { token: string, email: string}) => validateResetPasswordOTP(token, email),
        onSuccess: ({ data, error }) => {
            if (error) throw error
            toast.success(`OTP verified successfully, redirecting...`)
            router.replace(`/auth/reset-password?email=${data?.user?.email}`)
        },
        onError: (error) => {
            console.error(error)
            toast.error(error?.message)
        }
    })
}

export const useUpdateUniqueCode = () => {
    const router = useRouter()
    return useMutation({
        mutationKey: [QueryKeys.update_unique_code],
        mutationFn: async (data: {unique_code: string}) => updateUniqueCode(data?.unique_code),
        onSuccess: ({ data, error }) => {
            if (error) throw error
            router.refresh()
        },
        onError: (error) => {
            console.error(error)
            toast.error(error?.message)
        }
    })
}