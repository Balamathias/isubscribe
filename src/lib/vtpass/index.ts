export const VTPASS_SECRET_KEY = process.env.NEXT_VTPASS_SECRET_KEY
export const VTPASS_PUBLIC_KEY = process.env.NEXT_VTPASS_PUBLIC_KEY
export const VTPASS_BASE_URL = process.env.NEXT_VTPASS_TEST_BASE_URL ?? 'https://sandbox.vtpass.com/api/pay'

export declare interface VTPassBalanceResponse {
    code: number,
    contents:{
        balance: number
    }
}