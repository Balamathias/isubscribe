'use server'

import { AirtimeResponse, Payload, ResponseData } from "./types";

const baseURL = 'https://n3tdata.com/api'
const TOKEN = process.env.NEXT_N3TDATA_TOKEN

const username = process.env.NEXT_N3TDATA_USERNAME
const password = process.env.NEXT_N3TDATA_PASSWORD

export async function getUserToken() {
    
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    
    const requestOptions = {
        method: 'POST',
        headers: headers,
    };
    
    try {
        const res = await fetch(baseURL + '/user', requestOptions)
        if (!res.ok) {
            throw new Error('Error fetching user')
        }
        const data = await res.json()
        return { data, status: res.status }
    } catch (error: any) {
        console.log(error)
    }
}
  
export const buyData = async (payload: Payload): Promise<{data: ResponseData | null, status: number, OK: boolean, error?: string}> => {
    const headers: HeadersInit = new Headers({
        'Authorization': `Token ${TOKEN}`,
        'Content-Type': 'application/json',
    });
    
    try {
        const res = await fetch(baseURL + '/data', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
          })
          console.log(res.statusText, res)
          
          if (!res.ok) {
            console.error('Error fetching data')
            return {data: null, status: res.status, OK: false, error: res.statusText}
        }
        const data = await res.json()
        console.log(data)
        return { data, status: res.status, OK: true }
    } catch (error: any) {
        const _error = new Error(error)
        return {data: null, status: 500, error: _error.message, OK: false}
    }
}
  
export const buyAirtime = async (payload: Pick<Payload, 'bypass' | 'network' | 'phone' | 'request-id'> & {plan_type: string | 'VTU', amount: number}): Promise<{ data: AirtimeResponse | null, status: number, OK: boolean, error?: Error | string}> => {
    const headers: HeadersInit = new Headers({
        'Authorization': 'Token ' + TOKEN,
        'Content-Type': 'application/json',
    });
  
    try {
        const res = await fetch(baseURL + '/topup', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
          })
          
          if (!res.ok) {
            console.error('Error fetching data')
            return {data: null, status: res.status, OK: false, error: res.statusText }
        }
        const data = await res.json()
        return { data, status: res.status, OK: true }
    } catch (error: any) {
        console.error(error)
        const _error = new Error(error)
        return {data: null, status: 500, error: _error.message, OK: false}
    }
}

