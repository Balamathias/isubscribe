import { updateWalletBalanceByUser } from "@/lib/supabase/wallets";

import { updateCashbackBalanceByUser } from "@/lib/supabase/wallets";

export const updateWallet = async (
    userId: string,
    balance: number,
    cashbackBalance: number,
    deductableAmount: number,
    isRefund: boolean = false,
    retries: number = 3
): Promise<any> => {
    try {
        // Determine the operation based on whether it's a refund or deduction
        const newBalance = isRefund
            ? balance + deductableAmount // Refund increases balance
            : balance - deductableAmount; // Deduction decreases balance

        const [walletUpdate, cashbackUpdate] = await Promise.all([
            updateWalletBalanceByUser(userId, newBalance),
            updateCashbackBalanceByUser(userId, cashbackBalance) // Assume cashback balance is unaffected by refunds/deductions
        ]);

        return { walletUpdate, cashbackUpdate };
    } catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Retry after delay
            return updateWallet(userId, balance, cashbackBalance, deductableAmount, isRefund, retries - 1);
        }
        throw error; // Throw error after retries exhausted
    }
};
