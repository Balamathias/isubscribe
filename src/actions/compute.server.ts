'use server';

import { PaymentMethod } from "@/types/networks";
import { getWallet } from "@/lib/supabase/wallets";

export const computeServerTransaction = async ({
  payload,
}: {
  payload: { method?: PaymentMethod; price: number; cashback: number; interest?: number };
}) => {
  const { data: wallet } = await getWallet();

  const price = parseFloat(payload.price.toFixed(2));
  const cashbackPrice = parseFloat(payload.cashback.toFixed(2));
  const walletBalance = wallet?.balance ?? 0.0;
  let cashbackBalance = wallet?.cashback_balance ?? 0.0;

  let commission = Math.max(
    ((payload?.interest ?? 0) - cashbackPrice) - price * 0.0161,
    0
  );

  if (!walletBalance) {
    return {
      error: "Insufficient wallet balance, please fund your wallet!",
      data: null,
    };
  }

  if (payload?.method === "wallet") {
    if (walletBalance < price) {
      return {
        error: "Insufficient wallet balance, please fund your wallet!",
        data: null,
      };
    }
    cashbackBalance += cashbackPrice;
  } else if (payload?.method === "cashback") {
    cashbackBalance = cashbackBalance - price + cashbackPrice;

    if (cashbackBalance < 0) {
      return {
        error: "Insufficient cashback balance, please fund your wallet!",
        data: null,
      };
    }
  } else {
    return {
      error: "Invalid or bad data!",
      data: null,
    };
  }

  return {
    data: {
      balance: Math.max(walletBalance, 0),
      cashbackBalance: Math.max(cashbackBalance, 0),
      cashbackPrice,
      deductableAmount: price,
      price: Math.max(price, 0),
      commission,
    },
    error: null,
  };
};




// 'use server';

// import { PaymentMethod } from "@/types/networks"
// import { getWallet } from "@/lib/supabase/wallets";

// export const computeServerTransaction = async ({
//     payload,
// }: {
//     payload: { method?: PaymentMethod, price: number, cashback: number, interest?: number },
// }) => {
//   const { data: wallet } = await getWallet()
  
//   const price = (payload.price)
//   const cashbackPrice = (payload.cashback!)

//   let commission: number = 0

//   if (payload.interest)
//     commission = ((payload?.interest ?? 0) - cashbackPrice) - (price * 0.0161) /** @description: 1.61% monnify charges */

//   if (!wallet?.balance) {
//       return {
//         error: "Insufficient wallet balance, please fund your wallet!",
//         data: null
//       }
//   }
  
//   let balance = wallet?.balance ?? 0.00
//   let deductableAmount = 0.00
  
//   let cashbackBalance = wallet?.cashback_balance
  
//   if (payload?.method === 'wallet') {
//       balance = wallet?.balance ?? 0.00
//       deductableAmount = price

//       if (cashbackBalance)
//         cashbackBalance += cashbackPrice

//       if (balance < 0 || balance < price) {
//         return {
//           error: "Insufficient wallet balance, please fund your wallet!",
//           data: null
//         }
//       }
//   } else if (payload?.method === 'cashback') {
//       cashbackBalance = wallet?.cashback_balance ?? 0.00
//       cashbackBalance -= price
//       cashbackBalance += cashbackPrice
      
//       if (cashbackBalance < 0) {
//         return {
//           error: "Insufficient cashback balance, please fund your wallet!",
//           data: null
//         }
//       }
//   } else {
      
//       return {
//         error: 'Invalid or bad data!',
//         data: null
//       }
//   }
  
//   return { 
//       data: {
//         balance: balance > 0 ? balance : 0, 
//         cashbackBalance: Number(cashbackBalance) > 0 ?  Number(cashbackBalance) : 0, 
//         cashbackPrice, 
//         deductableAmount,
//         price: price > 0 ? price : 0, 
//         commission: commission < 0 ? 0 : commission,
//       },
//       error: null
//   }
// }