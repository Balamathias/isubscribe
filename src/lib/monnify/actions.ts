'use server'

import { baseURL, monnifyAPIKey, monnifyContractCode, monnifySecretKey } from ".";
import { InitiateSingleTransfer, InitiateSingleTransferResponse, InitiateTransferApiResponse, InitiateTransferProps, MonnifyUserTokenResponse, ReservedAccountApiResponse, ReservedAccountApiResponse_V2, ReservedAccountProps } from "./types";

const V2_URL = process.env.NEXT_MONNIFY_BASE_URL_V2 || 'https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts'

export async function getUserMonnifyToken(): Promise<MonnifyUserTokenResponse | undefined> {
    
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(monnifyAPIKey + ':' + monnifySecretKey));
    
    const requestOptions = {
        method: 'POST',
        headers: headers,
    };
    
    try {
        const res = await fetch(baseURL + '/auth/login', requestOptions)
        if (!res.ok) {
            throw new Error('Error fetching user')
        }
        const data = await res.json()
        return { data, status: res.status }
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
}

export const getReservedAccount = async (payload: ReservedAccountProps): Promise<ReservedAccountApiResponse | undefined> => {
    const token = (await getUserMonnifyToken())?.data?.responseBody?.accessToken
    const headers: HeadersInit = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    });

    payload.contractCode = monnifyContractCode as string
    console.log(payload)

    try {
        const res = await fetch(baseURL + '/bank-transfer/reserved-accounts', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
          })

          console.log(res.statusText, res.status,)
          console.log("MONNIFY RESPONSE: ", res)
          
          if (!res.ok) {
            console.error('Error fetching data')
            throw new Error('Failed to fetch reserved account')
        }
        const data = await res.json()
        return data
    } catch (error: any) {
        console.error("ERROR: ", error)
    }
}

export const initiateTransfer = async (payload: InitiateTransferProps): Promise<InitiateTransferApiResponse | undefined> => {
    const token = (await getUserMonnifyToken())?.data?.responseBody?.accessToken
    const headers: HeadersInit = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    });

    payload.contractCode = monnifyContractCode as string

    try {
        const res = await fetch(baseURL+'/merchant/transactions/init-transaction', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        })

        console.log(res.statusText, res.status)

        if (!res.ok) {
            console.error('Error fetching data')
            throw new Error('Failed to initiate transfer')
        }
        const data = await res.json()
        return data
    } catch (error: any) {
        console.error(error)
    }
}

export const initiateSingleTransfer = async (payload: InitiateSingleTransfer): Promise<InitiateSingleTransferResponse | undefined> => {
    const token = (await getUserMonnifyToken())?.data?.responseBody?.accessToken
    const headers: HeadersInit = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    });

    try {
        const res = await fetch(baseURL+'/disbursements/single', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        })

        console.log(res)

        if (!res.ok) {
            console.error('Error fetching data')
            throw new Error('Failed to initiate single transfer')
        }
        const data = await res.json()
        return data
    } catch (error: any) {
        console.error(error)
    }
}

export const deallocateAccount = async (reference: string): Promise<any | undefined> => {
    const token = (await getUserMonnifyToken())?.data?.responseBody?.accessToken
    const headers: HeadersInit = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    });

    try {
        const res = await fetch(baseURL + `/bank-transfer/reserved-accounts/reference/${reference}`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({})
        })

        console.log(res)

        if (!res.ok) {
            console.error('Error fetching data')
            throw new Error('Failed to initiate single transfer')
        }
        const data = await res.json()
        return data
    } catch (error: any) {
        console.error(error)
    }
}