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
