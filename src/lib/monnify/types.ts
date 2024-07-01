export type MonnifyUserTokenResponse = {
    status: number,
    data: {
    requestSuccessful: boolean;
    responseMessage: string;
    responseCode: string;
    responseBody: {
      accessToken: string;
      expiresIn: number;
    };
  },
}

export type ReservedAccountProps = {
  accountReference: string;
  accountName: string;
  currencyCode: string;
  contractCode?: string;
  customerEmail: string;
  bvn?: string;
  nin?: string;
  customerName: string;
  getAllAvailableBanks: boolean;
  preferredBanks?: string[];
};

export interface ReservedAccountInfo {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface ReservedResponseBody {
  contractCode: string;
  accountReference: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  currencyCode: string;
  customerEmail: string;
  customerName: string;
  accounts: ReservedAccountInfo[];
  collectionChannel: string;
  reservationReference: string;
  reservedAccountType: string;
  status: 'ACTIVE' | 'STALE';
  createdOn: string;
  incomeSplitConfig: any[];
  bvn: string;
  nin: string;
  restrictPaymentSource: boolean;
}

export interface ReservedAccountApiResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: ReservedResponseBody;
}


interface InitiateTransferResponseBody {
  transactionReference: string;
  paymentReference: string;
  merchantName: string;
  apiKey: string;
  enabledPaymentMethod: string[];
  checkoutUrl: string;
}

export interface InitiateTransferApiResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: InitiateTransferResponseBody;
}

export interface InitiateTransferProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  paymentDescription: string;
  currencyCode: string;
  contractCode?: string;
  redirectUrl: string;
  paymentMethods: ('CARD' | 'ACCOUNT_TRANSFER')[];
}

export interface InitiateSingleTransfer {
  amount: number;
  reference: string;
  narration: string;
  destinationBankCode: string;
  destinationAccountNumber: string;
  currency: string;
  sourceAccountNumber: string;
  destinationAccountName: string;
}

export interface InitiateSingleTransferResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody:  {
    amount: number;
    reference: string;
    status: string;
    dateCreated: string;
    totalFee: number;
    sessionId: string;
    destinationAccountName: string;
    destinationBankName: string;
    destinationAccountNumber: string;
    destinationBankCode: string;
  }
}