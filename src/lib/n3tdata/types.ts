export type Payload = {
    network: number;
    phone: string;
    data_plan: number;
    bypass: boolean;
    'request-id': string;
  };

export type Networks = 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'