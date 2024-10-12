import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DATA_MB_PER_NAIRA = 1

export const formatDataAmount = (amount: number) => {
  if (amount <= 1.024)
    return `${amount.toFixed(2)} KB`
  
  else if (amount > 1 && amount <= 1024)
    return `${amount.toFixed(2)} MB`

  else return `${(amount/1000).toFixed(2)} GB`
}