'use server'

import { formatNigerianNaira } from "@/funcs/formatCurrency"
import { getUser } from "@/lib/supabase/accounts"
import { getWallet } from "@/lib/supabase/wallets"
import { EVENT_TYPE } from "@/utils/constants/EVENTS"
import { createClient } from "@/utils/supabase/server"

export const sendMoney = async (payload: { amount: number, accountNumber: string }) => {

    const [{ data: wallet }, { data: user }] = await Promise.all([getWallet(), getUser()])

    if (!wallet || !wallet?.balance) {
        return { error: 'Wallet not found or insufficient funds' }
    }

    if (wallet?.balance < payload.amount) {
        return { error: 'Insufficient balance' }
    }

    if (wallet?.balance >= payload.amount) {
        const supabase = createClient()

        const { error } = await supabase.from('wallet').update({
            balance: wallet.balance - payload.amount
        }).eq('id', wallet.id).select()

        if (error) {
            return { error: error.message }
        }

        const {data: recipient, error: recipientError} = await supabase.from('account').select(`*, profile(*)`).eq('account_number', payload.accountNumber).single()

        if (recipientError) {
            return { error: recipientError.message }
        }

        if (!recipient) {
            return { error: 'Recipient not found' }
        }

        const { data: recipientWallet, error: recipientWalletError } = await supabase.from('wallet').select().eq('user', recipient.user).single()

        if (recipientWalletError) {
            return { error: recipientWalletError.message }
        }

        if (!recipientWallet) {
            return { error: 'Recipient wallet not found' }
        }

        const { error: recipientUpdateError } = await supabase.from('wallet').update({
            balance: Math.max((recipientWallet?.balance || 0) + payload.amount, 0)
        }).eq('id', recipientWallet.id).select()

        if (recipientUpdateError) {
            return { error: recipientUpdateError.message }
        } 

        const [{ data: transaction, error: transactionError }, { data: recipientTransaction, error: recipientTransactionError }] = await Promise.all([
            await supabase.from('history').insert({
                type: EVENT_TYPE.money_transfer,
                description:`You transferred ${formatNigerianNaira(payload.amount)} to ${recipient?.profile?.full_name}`,
                status: 'success',
                title: 'Money transfer',
                user: wallet.user,
                meta_data: JSON.stringify({ amount: payload.amount, recipient: recipient.id, recipient_name: recipient?.profile?.full_name, recipient_email: recipient?.profile?.email }),
                amount: payload.amount!,
                transaction_id: Math.random().toString(36).substring(7),
            }).select(),

            await supabase.from('history').insert({
                type: EVENT_TYPE.money_transfer,
                description:`You have received ${formatNigerianNaira(payload.amount)} from ${user?.full_name}`,
                status: 'success',
                title: 'Money transfer',
                user: recipient.user,
                meta_data: JSON.stringify({ amount: payload.amount, sender: wallet.user, sender_name: user?.full_name, sender_email: user?.email }),
                amount: payload.amount!,
                transaction_id: Math.random().toString(36).substring(7),
            }).select()
        ])

        if (transactionError) {
            return { error: transactionError.message }
        }

        if (recipientTransactionError) {
            return { error: recipientTransactionError.message }
        }

        return { data: transaction || null, error: null }
    }

}