"use server"

import { updateWalletBalanceByUser } from "@/lib/supabase/wallets";

export const updateWallet = async (
    userId: string,
    balance: number,
    cashbackBalance: number,
    deductableAmount: number,
    isRefund: boolean = false,
    retries: number = 3
): Promise<any> => {
    try {
        const newBalance = isRefund
            ? balance + deductableAmount
            : balance - deductableAmount;

        const [walletUpdate] = await Promise.all([
            updateWalletBalanceByUser(userId, newBalance, cashbackBalance),
        ]);

        return { walletUpdate };
    } catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return updateWallet(userId, balance, cashbackBalance, deductableAmount, isRefund, retries - 1);
        }
        throw error;
    }
};






// const updateWallet = async (retries = 3) => {
//     try {
//         const [walletUpdate, cashbackUpdate] = await Promise.all([
//             updateWalletBalanceByUser(profile?.id!, (balance - deductableAmount)),
//             updateCashbackBalanceByUser(profile?.id!, cashbackBalance)
//         ])
        
//         return { walletUpdate, cashbackUpdate }
//     } catch (error) {
//         if (retries > 0) {
//             await new Promise(resolve => setTimeout(resolve, 1000))
//             return updateWallet(retries - 1)
//         }
//         throw error
//     }
// }  
