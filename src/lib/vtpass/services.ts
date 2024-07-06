'use server'

import axios from 'axios'
import { VTPassBalanceResponse, VTPASS_BASE_URL, VTPASS_SECRET_KEY, VTPASS_PUBLIC_KEY, VTPassTransactionResponse, VTPassVariationServiceResponse, VTPassTransactionRequest, VTPassServiceName, VTPASS_API_KEY  } from '.'

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
    const res = await axios.get(`${VTPASS_BASE_URL}/service-variations?serviceID=${serviceID}`)
    return res.data
}

export const buyData = async (data: VTPassTransactionRequest): Promise<VTPassTransactionResponse | undefined> => {
    const headers = {
        'api-key': VTPASS_API_KEY!,
        'secret-key': VTPASS_SECRET_KEY!,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(`${VTPASS_BASE_URL}/pay`, data, { headers })
    console.log(res.statusText)
    if (res.status !== 200) {
        throw new Error('Failed to buy data')
    }
    return res.data
}
