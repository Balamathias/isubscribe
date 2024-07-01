interface Product {
    reference: string;
    type: string;
}

interface PaymentSourceInformation {
    bankCode: string,
    amountPaid: number,
    accountName: string,
    sessionId: string,
    accountNumber: string
}

interface DestinationAccountInformation {
    bankCode: string;
    bankName: string;
    accountNumber: string;
}

interface Customer {
    name: string;
    email: string;
}

interface EventData {
    product: Product;
    transactionReference: string;
    paymentReference: string;
    paidOn: string;
    paymentDescription: string;
    metaData: Record<string, any>;
    paymentSourceInformation: PaymentSourceInformation[];
    destinationAccountInformation: DestinationAccountInformation;
    amountPaid: number;
    totalPayable: number;
    cardDetails: Record<string, any>;
    paymentMethod: string;
    currency: string;
    settlementAmount: string;
    paymentStatus: string;
    customer: Customer;
}

export interface TransactionEvent {
    eventData: EventData;
    eventType: 'SUCCESSFUL_TRANSACTION' | 'FAILED_TRANSACTION';
}
  