export const VTPASS_SECRET_KEY = process.env.NEXT_VT_SECRET_KEY
export const VTPASS_API_KEY = process.env.NEXT_VT_API_KEY
export const VTPASS_PUBLIC_KEY = process.env.NEXT_VT_PUBLIC_KEY
export const VTPASS_BASE_URL = process.env.NEXT_VT_LIVE_BASE_URL ?? 'https://sandbox.vtpass.com/api/pay'

export declare interface VTPassBalanceResponse {
    code: number,
    contents:{
        balance: number
    }
}

export declare type VTPassServiceName = 'mtn-data' | 'glo-data' | 'airtel-data' | '9mobile-data' | 'etisalat-data' | 'glo-sme-data' | '9mobile-sme-data' | 'smile-direct'

export declare interface VTPassVariationServiceResponse {
    response_description: string;
    content: {
        ServiceName: string;
        serviceID: VTPassServiceName;
        convinience_fee: string;
        varations: VTPassVariation[];
    };
}

export declare interface VTPassVariation {
    variation_code: string;
    name: string;
    variation_amount: string;
    fixedPrice: 'Yes' | 'No';
}

export declare interface VTPassTransactionRequest {
    request_id: string; 
    serviceID: string; 
    billersCode: string;
    variation_code: string; 
    amount?: number;
    phone: number | string;
    subscription_type?: "Change" | "Renew"
}

export declare interface VTPassAirtimeTransactionRequest {
    request_id: string; 
    serviceID: 'glo' | 'mtn' | 'airtel' | 'etisalat'; 
    amount?: number;
    phone: number | string;
}

export declare interface VTPassAirtimeTransactionResponse {  
    code: string,
    response_description: string,
    requestId: string,
    transactionId: string,
    amount: string,
    transaction_date:{  
       date: string,
       timezone_type: number,
       timezone: string
    },
    purchased_code: string
 }

export declare interface Transaction {
    status: 'initiated' | 'pending' | 'delivered' | 'failed' | 'success';
    product_name: string;
    unique_element: string;
    unit_price: number;
    quantity: number;
    service_verification: null | string;
    channel: string;
    commission: number;
    total_amount: number;
    discount: null | string;
    type: string;
    email: string;
    phone: string;
    name: null | string;
    convinience_fee: number;
    amount: number;
    platform: string;
    method: string;
    transactionId: string;
}
  
interface TransactionDate {
    date: string;
    timezone_type: number;
    timezone: string;
}
  
export interface VTPassTransactionResponse {
    code: string;
    content: {
      transactions: Transaction;
    };
    response_description: string;
    requestId: string;
    amount: string;
    transaction_date: TransactionDate;
    purchased_code: string;
}