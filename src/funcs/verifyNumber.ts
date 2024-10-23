'use server'

import { redisIO } from '@/lib/redis';
import { Networks } from '@/types/networks'

interface PhoneNumberInfo {
    status: 'success' | 'error';
    phone: string;
    phone_valid: boolean;
    phone_type: 'fixed_line' | 'mobile' | 'unknown' | 'fixed_line_or_mobile' | 'toll_free' | 'premium_rate' | 'shared_cost' | 'voip';
    phone_region: string;
    country: string;
    country_code: string; // 2 characters ISO code
    country_prefix: string;
    international_number: string;
    local_number: string;
    e164: string;
    carrier: string;
  }
  

const API_KEY = process.env.NEXT_VERIPHONE_API_KEY!
const URL = 'https://api.veriphone.io/v2/verify'


export const verifyNumber = async (phone: string): Promise<Networks | undefined> => {

    const cached = await redisIO.get(`phone:${phone}`)
    if (cached) {
        const data = JSON.parse(cached) as PhoneNumberInfo
        const carrier = data?.carrier as 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'
        return carrier.toLowerCase() as Networks
    }

    const req = await fetch(`${URL}?key=${API_KEY}&phone=${phone}&default_country=NG`)

    if (!req.ok) return undefined

    if (req.status === 402) console.log('You exhausted your limit')

    const data = await req.json() as PhoneNumberInfo

    await redisIO.set(`phone:${phone}`, JSON.stringify(data))

    const carrier = data?.carrier as 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'

    return carrier.toLowerCase() as Networks
}