import { PaymentMethod } from "@/types/networks"
import { Tables } from "@/types/database"

export const computeTransaction = ({
    payload,
    wallet,
}: {
    payload: { method?: PaymentMethod, price: number, cashback: number },
    wallet: Tables<'wallet'>
}) => {
        const price = (payload.price)
        const cashbackPrice = (payload.cashback!)

        if (!wallet?.balance) return 
        
        let balance = wallet?.balance ?? 0.00
        let deductableAmount = 0.00
        
        let cashbackBalance = wallet?.cashback_balance ?? 0.00
        
        if (payload?.method === 'wallet') {
            balance = wallet?.balance ?? 0.00
            deductableAmount = price
            cashbackBalance += cashbackPrice
            if (balance < 0 || balance < price) return /** @example: Edge case, balance cannot be negative! */
        } else if (payload?.method === 'cashback') {
            cashbackBalance = wallet?.cashback_balance ?? 0.00
            cashbackBalance -= price
            cashbackBalance += cashbackPrice
            
            if (cashbackBalance < 0) return /** @example: Ensure that cashbackBalance is not below 0 */
        } else {
            return
        }
        
        return { balance, cashbackBalance, cashbackPrice, deductableAmount, price }
}