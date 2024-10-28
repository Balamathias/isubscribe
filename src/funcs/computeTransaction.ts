import { PaymentMethod } from "@/types/networks"
import { Tables } from "@/types/database"
import { toast } from "sonner"

export const computeTransaction = ({
    payload,
    wallet,
}: {
    payload: { method?: PaymentMethod, price: number, cashback: number, interest?: number },
    wallet: Tables<'wallet'>
}) => {
        const price = (payload.price)
        const cashbackPrice = (payload.cashback!)

        const commission: number = ((payload?.interest ?? 0) - cashbackPrice) - (price * 0.015) /** @description: 1.5% monnify charges */

        if (!wallet?.balance) {
            toast.info("Insufficient wallet balance, please fund your wallet!")
            return
        }
        
        let balance = wallet?.balance ?? 0.00
        let deductableAmount = 0.00
        
        let cashbackBalance = wallet?.cashback_balance ?? 0.00
        
        if (payload?.method === 'wallet') {
            balance = wallet?.balance ?? 0.00
            deductableAmount = price
            cashbackBalance += cashbackPrice
            if (balance < 0 || balance < price) return /** @description: Edge case, balance cannot be negative! */
        } else if (payload?.method === 'cashback') {
            cashbackBalance = wallet?.cashback_balance ?? 0.00
            cashbackBalance -= price
            cashbackBalance += cashbackPrice
            
            if (cashbackBalance < 0) return /** @desc: Ensure that cashbackBalance is not below 0 */
        } else {
            toast.error('Invalid or bad data!')
            return
        }
        
        return { 
            balance, 
            cashbackBalance, 
            cashbackPrice, 
            deductableAmount,
            price, 
            commission: commission < 0 ? 0 : commission
        }
}