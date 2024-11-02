// src/app/api/webhook/paystack/route.ts

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
  };
}

export async function POST(req: NextRequest) {
  const paystackEvent: PaystackEvent = await req.json();

  switch (paystackEvent.event) {
    case 'customeridentification.success':
      console.log('Customer identification successful:', paystackEvent.data);
      // Update customer verification status in your database
      break;

    case 'customeridentification.failed':
      console.error('Customer identification failed:', paystackEvent.data);
      console.log('Failure reason:', paystackEvent.data.reason);
      // Handle failure, e.g., log failure reason and alert customer
      break;

    case 'charge.success':
      console.log('Bank transfer received:', paystackEvent.data.authorization);
      // Process successful bank transfer, e.g., update transaction record in your database
      break;

    default:
      console.warn('Unhandled event type:', paystackEvent.event);
      break;
  }

  // Respond with a 200 status to acknowledge receipt of the event
  return NextResponse.json({ message: 'Event received' }, { status: 200 });
}
