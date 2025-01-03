export type Payload = {
    network: number;
    phone: string;
    data_plan: number;
    bypass: boolean;
    'request-id': string;
    metadata?: any;
  };

export type Networks = 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'

export interface ResponseData {
  network: string
  'request-id': string
  amount: string,
  dataplan: string,
  status: 'success' | 'fail' | 'pending',
  transid: string,
  message: string,
  phone_number: string,
  oldbal: number,
  newbal: number,
  system: string,
  plan_type: 'COOPERATE GIFTING' | 'SME',
  wallet_vending: 'wallet' | 'bonus' | 'cashback',
  response: string,
}

export interface AirtimeResponse {
  network: string
  'request-id': string
  amount: string,
  discount: number,
  status: 'success' | 'fail',
  transid?: string,
  message: string,
  phone_number: string,
  oldbal: number,
  newbal: number,
  system: string,
  plan_type: 'VTU',
  wallet_vending: 'wallet' | 'bonus' | 'cashback',
  response?: string,
}
