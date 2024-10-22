export type Networks = 'mtn' | 'glo' | 'airtel' | '9mobile' 
export type PaymentMethod = 'wallet' | 'cashback' | 'card'

export interface SubDataProps {
    Plan_ID: number;
    Type: string;
    Data: string;
    Price: string;
    Duration: string;
    CashBack: string;
}

export interface SubAirtimeProps {
    Plan_ID: number;
    plan_type: string;
    Price: string;
    CashBack: string;
}

export interface VTPassAirtimePayload {
    phone: number | string;
    serviceID: 'glo' | 'mtn' | 'airtel' | 'etisalat',
    amount: number,
    cashback?: number
}

export interface VTPassDataPayload {
    serviceID: string,
    variation_code: string,
    amount?: number,
    phone?: string | number,
    cashback?: string | number,
    interest?: number,
    detail?: {
        network: string;
        dataAmount?: string | number;
        duration: string;
        dataQty: string;
    }
}