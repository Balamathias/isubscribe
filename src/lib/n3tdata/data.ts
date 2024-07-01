import { Networks } from "./types";

type DataPlan = {
    id: number;
    provider: string;
    category: string;
    dataAmount: string;
    price: string;
    duration: string;
};
  
export const dataPlans: DataPlan[] = [
  { id: 1, provider: 'MTN', category: 'SME', dataAmount: '500MB', price: '130.00', duration: '1 Month' },
  { id: 2, provider: 'MTN', category: 'SME', dataAmount: '1GB', price: '260.00', duration: '1 Month' },
  { id: 3, provider: 'MTN', category: 'SME', dataAmount: '2GB', price: '520.00', duration: '1 Month' },
  { id: 4, provider: 'MTN', category: 'SME', dataAmount: '3GB', price: '780.00', duration: '1 Month' },
  { id: 5, provider: 'MTN', category: 'SME', dataAmount: '5GB', price: '1300.00', duration: '1 Month' },
  { id: 6, provider: 'MTN', category: 'SME', dataAmount: '10GB', price: '2600.00', duration: '1 Month' },
  { id: 20, provider: 'GLO', category: 'GIFTING', dataAmount: '1.35GB', price: '480.00', duration: '1 Month' },
  { id: 21, provider: 'GLO', category: 'GIFTING', dataAmount: '2.9GB', price: '970.00', duration: '1 Month' },
  { id: 22, provider: 'GLO', category: 'GIFTING', dataAmount: '4.1GB', price: '1450.00', duration: '1 Month' },
  { id: 24, provider: 'GLO', category: 'GIFTING', dataAmount: '5.8GB', price: '1900.00', duration: '1 Month' },
  { id: 36, provider: '9MOBILE', category: 'GIFTING', dataAmount: '1.5GB', price: '950.00', duration: '1 Month' },
  { id: 37, provider: '9MOBILE', category: 'GIFTING', dataAmount: '2GB', price: '1100.00', duration: '1 Month' },
  { id: 38, provider: '9MOBILE', category: 'GIFTING', dataAmount: '3GB', price: '1400.00', duration: '1 Month' },
  { id: 39, provider: '9MOBILE', category: 'GIFTING', dataAmount: '4.5GB', price: '1800.00', duration: '1 Month' },
  { id: 46, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '500MB', price: '140.00', duration: '1 Month' },
  { id: 47, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '1GB', price: '280.00', duration: '1 Month' },
  { id: 48, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '2GB', price: '560.00', duration: '1 Month' },
  { id: 49, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '5GB', price: '1400.00', duration: '1 Month' },
  { id: 50, provider: 'MTN', category: 'COOPERATE GIFTING', dataAmount: '500MB', price: '130.00', duration: '1 Month' },
  { id: 51, provider: 'MTN', category: 'COOPERATE GIFTING', dataAmount: '1GB', price: '260.00', duration: '1 Month' },
  { id: 52, provider: 'MTN', category: 'COOPERATE GIFTING', dataAmount: '2GB', price: '520.00', duration: '1 Month' },
  { id: 53, provider: 'MTN', category: 'COOPERATE GIFTING', dataAmount: '3GB', price: '780.00', duration: '1 Month' },
  { id: 54, provider: 'MTN', category: 'COOPERATE GIFTING', dataAmount: '5GB', price: '1300.00', duration: '1 Month' },
  { id: 55, provider: 'MTN', category: 'COOPERATE GIFTING', dataAmount: '10GB', price: '2600.00', duration: '1 Month' },
  { id: 56, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '10GB', price: '2800.00', duration: '1 Month' },
  { id: 57, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '200MB', price: '50.00', duration: '1 Month' },
  { id: 58, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '500MB', price: '125.00', duration: '1 Month' },
  { id: 59, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '1GB', price: '250.00', duration: '1 Month' },
  { id: 60, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '2GB', price: '500.00', duration: '1 Month' },
  { id: 61, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '3GB', price: '750.00', duration: '1 Month' },
  { id: 62, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '5GB', price: '1250.00', duration: '1 Month' },
  { id: 63, provider: 'GLO', category: 'COOPERATE GIFTING', dataAmount: '10GB', price: '2500.00', duration: '1 Month' },
  { id: 65, provider: 'MTN', category: 'GIFTING', dataAmount: '1GB', price: '250.00', duration: '7 Days' },
  { id: 67, provider: 'MTN', category: 'GIFTING', dataAmount: '3GB', price: '750.00', duration: '1 Month' },
  { id: 70, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '300MB', price: '90.00', duration: '1 Month' },
  { id: 71, provider: 'AIRTEL', category: 'COOPERATE GIFTING', dataAmount: '100MB', price: '40.00', duration: '1 Month' },
  { id: 72, provider: '9MOBILE', category: 'COOPERATE GIFTING', dataAmount: '500MB', price: '100.00', duration: '1 Month' },
  { id: 73, provider: '9MOBILE', category: 'COOPERATE GIFTING', dataAmount: '1GB', price: '200.00', duration: '1 Month' },
  { id: 74, provider: '9MOBILE', category: 'COOPERATE GIFTING', dataAmount: '2GB', price: '400.00', duration: '1 Month' },
  { id: 75, provider: '9MOBILE', category: 'COOPERATE GIFTING', dataAmount: '3GB', price: '600.00', duration: '1 Month' },
  { id: 76, provider: '9MOBILE', category: 'COOPERATE GIFTING', dataAmount: '5GB', price: '1000.00', duration: '1 Month' },
  { id: 77, provider: '9MOBILE', category: 'COOPERATE GIFTING', dataAmount: '10GB', price: '2000.00', duration: '1 Month' }
];

export const filterPlans = (provider: 'MTN' | 'GLO' | '9MOBILE' | 'AIRTEL', cat?: 'SME' | 'CGIFT') => {
  if (cat) {
    return dataPlans.filter(plan => (plan.provider === provider && plan.category === cat))
  }
  return dataPlans.filter(plan => plan.provider === provider)
}

export const convertNetworkNameToNetworkCode = (network: Networks) => {
    const networkCodes = {
        'MTN': 1,
        'GLO': 2,
        'AIRTEL': 4,
        '9MOBILE': 3
    }
    return networkCodes[network]

}
  