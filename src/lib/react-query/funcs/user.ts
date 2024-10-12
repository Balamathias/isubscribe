import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import { setPassPin } from "@/lib/supabase/pass-pin";
import { getUser, updateSecurityQuestion } from "@/lib/supabase/accounts";

export const useSetPassPin = () => useMutation({
    mutationKey: [QueryKeys.set_pass_pin],
    mutationFn: ({pin, ...rest}: {pin: string, phone?: string}) => setPassPin({pin, ...rest}),
})

export const useSetSecurityQ = () => useMutation({
    mutationKey: [QueryKeys.sq],
    mutationFn: (data: {security_answer: string, security_question: string}) => updateSecurityQuestion(data),
})

export const useGetProfile = () => useQuery({
    queryKey: [QueryKeys.get_user],
    queryFn: () => getUser(),
})