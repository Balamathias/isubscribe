'use server'

import axios from 'axios'
import { VTPassBalanceResponse, VTPassTransactionResponse, VTPassVariationServiceResponse, VTPassTransactionRequest, VTPassServiceName, VTPASS_BASE_URL, VTPASS_SECRET_KEY, VTPASS_PUBLIC_KEY, VTPASS_API_KEY, VTPassAirtimeTransactionRequest, VTPassAirtimeTransactionResponse,   } from '.'

import { redisIO } from '@/lib/redis'

class VTPassError extends Error {
    constructor(message: string, public code: number) {
        super(message)
    }

    static fromResponse(response: Response) {
        return new VTPassError('Failed to fetch VTPass balance', response.status)
    }
}

export const getVTPassBalance = async (): Promise<VTPassBalanceResponse | undefined> => {
    const response = await fetch(
        VTPASS_BASE_URL,
        {
            method: 'GET',
            headers: {
                'api-key': VTPASS_SECRET_KEY!,
                'public-key': VTPASS_PUBLIC_KEY!,
                'Content-Type': 'application/json'
            }
        }
    )

    if (!response.ok) {
        throw new VTPassError('Failed to fetch VTPass balance', response.status)
    }

    const data = (await response.json()) as VTPassBalanceResponse

    return data
}

export const getServiceVariations = async (serviceID: VTPassServiceName): Promise<VTPassVariationServiceResponse | undefined> => {
    const res = await redisIO.get(`service-variations-${serviceID}`)
    if (res) {
        return JSON.parse(res)
    } else {
        const res = await axios.get(`${VTPASS_BASE_URL}/service-variations?serviceID=${serviceID}`)

        await redisIO.set(`service-variations-${serviceID}`, JSON.stringify(res.data), 'EX', 60 * 60 * 1)
        
        return res.data
    }
}

export const buyData = async (data: VTPassTransactionRequest): Promise<VTPassTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    try {
        const res = await axios.post(`${VTPASS_BASE_URL}/pay`, data, { headers })
        console.log(res.statusText)
        if (res.status !== 200) {
            throw new Error('Failed to buy data')
        }
        return res.data
    } catch (error) {
        console.log(error)
        return
    }
}

export const buyAirtime = async (data: VTPassAirtimeTransactionRequest): Promise<VTPassAirtimeTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    try {
        const res = await axios.post(`${VTPASS_BASE_URL}/pay`, data, { headers })
        console.log(res.statusText)
        if (res.status !== 200) {
            throw new Error('Failed to buy data')
        }
        return res.data
    } catch (error) {
        console.log(error)
        return
    }
}

export const buyTvCable = async (data: VTPassTransactionRequest): Promise<VTPassTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(`${VTPASS_BASE_URL}/pay`, data, { headers })
    console.log(res.statusText)
    console.log("RESSSSS", res)
    if (res.status !== 200) {
        throw new Error('Failed to buy data')
    }
    return res.data
}


export const buyElectricity = async (data: VTPassTransactionRequest): Promise<VTPassTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(`${VTPASS_BASE_URL}/pay`, data, { headers })
    console.log(res.statusText)
    console.log("RESSSSS", res)
    if (res.status !== 200) {
        throw new Error('Failed to buy data')
    }
    return res.data
}



export const buyEducation = async (data: VTPassTransactionRequest): Promise<VTPassTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(`${VTPASS_BASE_URL}/pay`, data, { headers })
    console.log(res.statusText)
    console.log("RESSSSS", res)
    if (res.status !== 200) {
        throw new Error('Failed to buy exam pin')
    }
    return res.data
}

export const verifySmartcardNumber = async (data: any) => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(`${VTPASS_BASE_URL}/merchant-verify`, data, { headers })
    console.log(res.statusText)
    console.log("RESSSSS", res)
    if (res.status !== 200) {
        throw new Error('Failed to verify smartcard')
    }
    return res.data
}

export const requeryTransaction = async (id: string): Promise<VTPassTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(`${VTPASS_BASE_URL}/requery`, { request_id: id }, { headers })
    console.log(res.statusText)
    if (res.status !== 200) {
        throw new Error('Failed to requery transaction')
    }
    return res.data
}
