import { formatNigerianNaira } from "@/funcs/formatCurrency";
import { TransactionEvent } from "@/types/webhooks";
import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import sendEmail from "@/utils/sendMail";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { sha512 } from 'js-sha512';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const DEFAULT_MERCHANT_CLIENT_SECRET = process.env.NEXT_MONNIFY_SECRET_KEY!;

const computeHash = (requestBody: string) => {
  return sha512.hmac(DEFAULT_MERCHANT_CLIENT_SECRET, requestBody);
};

const insertHistory = async (data: TransactionEvent, userId: string, type: string, description: string, status: string) => {
    const supabase = createClient();

    const { error } = await supabase.from('history').insert({
        type,
        description,
        status,
        title: type === EVENT_TYPE.wallet_fund ? 'Wallet Fund' : 'Wallet Fund Failed',
        user: userId,
        meta_data: JSON.stringify(data.eventData),
        amount: data.eventData.amountPaid,
        transaction_id: data.eventData.transactionReference,
    }).select();

    if (error) {
        console.error(error);
        return false;
    }
    return true;
};

export const POST = async (req: Request) => {
    const signature = req.headers.get('x-monnify-signature') || '';

    const rawBody = await req.text();

    const computedHash = computeHash(rawBody);

    if (computedHash !== signature) {
        return NextResponse.json({ message: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    let data: TransactionEvent;

    try {
        data = await req.json() as TransactionEvent;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return NextResponse.json({ message: 'Invalid JSON data' }, { status: 400 });
    }

    const supabase = createClient();

    const { data: user, error } = await supabase
        .from('profile')
        .select('id, email, wallet(balance)')
        .eq('email', data.eventData?.customer?.email)
        .single();

    if (error || !user) {
        return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
    }

    if (data.eventType === 'SUCCESSFUL_TRANSACTION') {
        const success = await insertHistory(data, user.id, EVENT_TYPE.wallet_fund, 
            `Transferred ${formatNigerianNaira(data.eventData.amountPaid)} successfully to iSubscribe wallet.`,
            data.eventData.paymentStatus);

        if (!success) return NextResponse.json({ message: 'Saving History data failed' }, { status: 500 });

        await sendEmail({
            email: data.eventData.customer?.email,
            subject: 'Transfer successful',
            message: 'Your wallet transfer to iSubscribe was successful.',
        });

        return NextResponse.json({ message: 'Wallet credited successfully.' }, { status: 200 });
    }

    const failure = await insertHistory(data, user.id, EVENT_TYPE.wallet_fund_failed, 
        'Your attempt to fund your wallet was unsuccessful.',
        data.eventData.paymentStatus);

    if (!failure) return NextResponse.json({ message: 'Saving History data failed' }, { status: 500 });

    return NextResponse.json({ message: 'Wallet fund failed' }, { status: 400 });
};