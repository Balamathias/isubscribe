import { type ClassValue, clsx } from "clsx"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DATA_MB_PER_NAIRA = 3

export const formatDataAmount = (amount: number) => {
  if (amount <= 1.024)
    return `${amount.toFixed(2)} MB`
  
  else if (amount > 1 && amount <= 1024)
    return `${amount.toFixed(2)} MB`

  else return `${(amount/1000).toFixed(2)} GB`
}

/**
 * @description Clean and parse a Nigerian phone number into a standard format
 * @param phoneNumber string
 * 
 * @example
 * ```js
 * console.log(parseNigerianPhoneNumber('+2348012345678'));  // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('2348012345678'));   // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('8012345678'));      // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('08012345678'));     // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('080 1234 5678'));   // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('+234 080 1234 5678')); // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('234 080 1234 5678'));  // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('80 1234 5678'));    // Output: '08012345678'
 * console.log(parseNigerianPhoneNumber('12345678'));        // Output: null
 * ```
 * @returns a cleaned phone number string or null if invalid
 */
export function parseNigerianPhoneNumber(phoneNumber: string): string | null {
  const sanitizedNumber = phoneNumber.replace(/[^0-9+]/g, '');

  if (sanitizedNumber.startsWith('+234')) {
    return '0' + sanitizedNumber.slice(4);
  }

  if (sanitizedNumber.startsWith('234')) {
    return '0' + sanitizedNumber.slice(3);
  }

  if (/^[789]\d{9}$/.test(sanitizedNumber)) {
    return '0' + sanitizedNumber;
  }

  if (/^0\d{10}$/.test(sanitizedNumber)) {
    return sanitizedNumber;
  }

  return null;
}


export const dynamic = (a: ReactNode, b: ReactNode, c: boolean): ReactNode => {
  return c ? a : b
}

export function getGreeting(name?: string): string {
  const now = new Date();
  const hours = now.getHours();
  const day = now.getDate();
  const month = now.getMonth();

  let greeting: string

  if (month === 11 && day === 25) {
      greeting = `Merry Christmas`;
  }
  if (month === 0 && day === 1) {
      greeting = `Happy New Year`;
  }

  if (hours >= 5 && hours < 12) {
      greeting = `Good morning`;
  } else if (hours >= 12 && hours < 17) {
      greeting = `Good afternoon`;
  } else if (hours >= 17 && hours < 21) {
      greeting = `Good evening`;
  } else {
      greeting = `Hi`;
  }

  return name ? greeting + ' ' + name : greeting
}