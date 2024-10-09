import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import { getWallet } from "@/lib/supabase/wallets";

export const useGetWalletBalance = () => useQuery({
    queryKey: [QueryKeys.get_wallet],
    queryFn: () => getWallet(),
})
