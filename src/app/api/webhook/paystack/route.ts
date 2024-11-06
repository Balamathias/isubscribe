// src/app/api/webhook/paystack/route.ts

import { sha512 } from 'js-sha512';
import { NextRequest, NextResponse } from 'next/server';

interface PaystackEvent {
  event: string;
  data: {
    customer_id?: string | number;
    customer_code?: string;
    email?: string;
    identification?: {
      country: string;
      type: string;
      bvn: string;
      account_number: string;
      bank_code: string;
    };
    reason?: string;
    authorization?: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string | null;
      sender_bank: string;
      sender_bank_account_number: string;
      sender_country: string;
      sender_name: string;
      narration: string;
      receiver_bank_account_number: string;
      receiver_bank: string;
    };
    id?: number;
    amount?: number;
    currency?: string;
    status?: string;
    reference?: string;
    gateway_response?: string;
    paid_at?: string;
    created_at?: string;
    customer?: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone?: string | null;
      metadata?: any;
      risk_action?: string;
    };
    request_code?: string;
    paid?: boolean;
    description?: string;
    notifications?: { sent_at: string; channel: string }[];
    recipient?: {
      id: number;
      name: string;
      recipient_code: string;
      currency: string;
      details: {
        account_number: string;
        bank_code: string;
        bank_name: string;
      };
    };
    transfer_code?: string;
  };
}

const computeHash = (requestBody: string) => {
  return sha512.hmac(process.env.NEXT_PAYSTACK_SECRET_KEY!, requestBody);
};

export async function POST(req: NextRequest) {
  const allowedIPs = ['52.31.139.75', '52.49.173.169', '52.214.14.220'];
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip');

  if (!allowedIPs.includes(ip!)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const signature = req.headers.get('x-paystack-signature') || '';
  const rawBody = await req.text();
  const computedHash = computeHash(rawBody);

  if (computedHash !== signature) {
    return NextResponse.json({ message: 'Unauthorized: Invalid signature' }, { status: 401 });
  }

  const paystackEvent = JSON.parse(rawBody) as PaystackEvent;

  switch (paystackEvent.event) {
    case 'customeridentification.success':
      console.log('Customer identification successful:', paystackEvent.data);
      break;

    case 'customeridentification.failed':
      console.error('Customer identification failed:', paystackEvent.data);
      console.log('Failure reason:', paystackEvent.data.reason);
      break;

    case 'charge.success':
      console.log('Bank transfer received:', paystackEvent.data.authorization);
      break;

    case 'paymentrequest.pending':
      console.log('Payment request pending:', paystackEvent.data);
      break;

    case 'paymentrequest.success':
      console.log('Payment request successful:', paystackEvent.data);
      break;

    case 'transfer.success':
      console.log('Transfer successful:', paystackEvent.data);
      // Handle transfer success, e.g., log transaction details or update recipient’s balance
      break;

    case 'transfer.failed':
      console.error('Transfer failed:', paystackEvent.data);
      console.log('Failure reason:', paystackEvent.data.reason);
      // Handle transfer failure, e.g., alert recipient or retry transfer
      break;

    case 'transfer.reversed':
      console.log('Transfer reversed:', paystackEvent.data);
      // Handle transfer reversal, e.g., notify customer and adjust balance
      break;

    default:
      console.warn('Unhandled event type:', paystackEvent.event);
      break;
  }

  return NextResponse.json({ message: 'Event received' }, { status: 200 });
}
