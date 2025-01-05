'use server';

import { PaymentMethod } from "@/types/networks"
import { getWallet } from "@/lib/supabase/wallets";

export const computeServerTransaction = async ({
    payload,
}: {
    payload: { method?: PaymentMethod, price: number, cashback: number, interest?: number },
}) => {
  const { data: wallet } = await getWallet()
  
  const price = (payload.price)
  const cashbackPrice = (payload.cashback!)

  let commission: number = 0

  if (payload.interest)
    commission = ((payload?.interest ?? 0) - cashbackPrice) - (price * 0.0161) /** @description: 1.61% monnify charges */

  if (!wallet?.balance) {
      return {
        error: "Insufficient wallet balance, please fund your wallet!",
        data: null
      }
  }
  
  let balance = wallet?.balance ?? 0.00
  let deductableAmount = 0.00
  
  let cashbackBalance = wallet?.cashback_balance ?? 0.00
  
  if (payload?.method === 'wallet') {
      balance = wallet?.balance ?? 0.00
      deductableAmount = price
      cashbackBalance += cashbackPrice
      if (balance < 0 || balance < price) {
        return {
          error: "Insufficient wallet balance, please fund your wallet!",
          data: null
        }
      }
  } else if (payload?.method === 'cashback') {
      cashbackBalance = wallet?.cashback_balance ?? 0.00
      cashbackBalance -= price
      cashbackBalance += cashbackPrice
      
      if (cashbackBalance < 0) {
        return {
          error: "Insufficient cashback balance, please fund your wallet!",
          data: null
        }
      }
  } else {
      
      return {
        error: 'Invalid or bad data!',
        data: null
      }
  }
  
  return { 
      data: {
        balance, 
        cashbackBalance, 
        cashbackPrice, 
        deductableAmount,
        price, 
        commission: commission < 0 ? 0 : commission,
      },
      error: null
  }
}