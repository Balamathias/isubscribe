'use server'

const termiiURL = process.env.NEXT_TERMII_BASE_URL;
const termiiApiKey = process.env.NEXT_TERMII_API_KEY;

interface TermiiResponse {
    number: string;
    status: string;
    network: string;
    network_code: string;
}

export const verifyPhoneNumber = async (phoneNumber: string): Promise<TermiiResponse> => {
    try {
        const response = await fetch(`${termiiURL}/api/check/dnd?api_key=${termiiApiKey}&phone_number=${phoneNumber}`)
        console.log(response)
        
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return {
            number: phoneNumber,
            status: 'error',
            network: 'error',
            network_code: 'error',
        }
    }
}
