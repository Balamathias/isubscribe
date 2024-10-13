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

/**
 * @description Clean a phone number
 * @param phoneNumber number
 * 
 * @example
 * ```js
console.log(parseNigerianPhoneNumber('+2348012345678')); // Output: '08012345678'
console.log(parseNigerianPhoneNumber('2348012345678'));  // Output: '08012345678'
console.log(parseNigerianPhoneNumber('8012345678'));     // Output: '08012345678'
console.log(parseNigerianPhoneNumber('12345678'));       // Output: null
```
 * @returns 
 */
export function parseNigerianPhoneNumber(phoneNumber: string): string | null {
  const sanitizedNumber = phoneNumber.replace(/[^0-9+]/g, '');

  if (sanitizedNumber.startsWith('+234')) {
      return '0' + sanitizedNumber.slice(4);
  } else if (sanitizedNumber.startsWith('234')) {
      return '0' + sanitizedNumber.slice(3);
  } else if (sanitizedNumber.length === 10) {
      return '0' + sanitizedNumber;
  } else {
      return null;
  }
}

