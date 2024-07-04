export type Networks = 'mtn' | 'glo' | 'airtel' | '9mobile'

export interface SubDataProps {
    Plan_ID: number;
    Type: string;
    Data: string;
    Price: string;
    Duration: string;
    CashBack: string;
}

export type PaymentMethod = 'wallet' | 'cashback' | 'card'