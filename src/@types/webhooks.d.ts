export interface WebhookResponse_N3T {
    status: string;
    "request-id": string;
    response: string;
}

export interface TransactionUpdate {
    type: string; // "transaction-update"
    data: {
      code: string; // "000"
      content: {
        transactions: {
          status: 'delivered' | 'reversed'; // "delivered"
          product_name: string; // "Airtel Airtime"
          unique_element: string; // "08011111111"
          unit_price: number; // 5
          quantity: number; // 1
          service_verification: string | null; // null
          channel: string; // "api"
          commission: number; // 0
          total_amount: number; // 4.85
          discount: number | null; // null
          type: string; // "Airtime Recharge"
          email: string; // "degodtest@gmail.com"
          phone: string; // "07061933309"
          name: string | null; // null
          convinience_fee: number; // 0
          amount: number; // 5
          platform: string; // "api"
          method: string; // "wallet"
          transactionId: string; // "1583519914158857111079"
        };
      };
      response_description: string; // "TRANSACTION DELIVERED"
      amount: number; // 5
      transaction_date: string | null; // null
      requestId: string; // "ELAET1RA7PC06250-12S5962-2102P"
      purchased_code: string; // ""
    };
}
  