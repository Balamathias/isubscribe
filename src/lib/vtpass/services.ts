'use server'

import { VTPassBalanceResponse, VTPASS_BASE_URL, VTPASS_SECRET_KEY, VTPASS_PUBLIC_KEY  } from '.'

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