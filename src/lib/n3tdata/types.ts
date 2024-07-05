export type Payload = {
    network: number;
    phone: string;
    data_plan: number;
    bypass: boolean;
    'request-id': string;
  };

export type Networks = 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'

export interface ResponseData {
  network: string
  'request-id': string
  amount: string,
  dataplan: string,
  status: 'success' | 'failed',
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