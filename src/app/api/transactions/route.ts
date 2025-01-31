import { formatNigerianNaira } from "@/funcs/formatCurrency";
import { TransactionEvent } from "@/types/webhooks";
import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import sendEmail from "@/utils/sendMail";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { sha512 } from 'js-sha512';
import { Json } from "@/types/database";

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
        status: status === 'PAID' ? 'success' : status,
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
    const signature = req.headers.get('monnify-signature') || '';

    const rawBody = await req.text();

    const computedHash = computeHash(rawBody);

    if (computedHash !== signature) {
        return NextResponse.json({ message: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    const allowedIPs = ['35.242.133.146']
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip')

    if (!allowedIPs.includes(ip!)) {
        return NextResponse.json({message: 'Unauthorized'}, {status: 401})
    }

    let data: TransactionEvent;

    try {
        data = JSON.parse(rawBody) as TransactionEvent;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return NextResponse.json({ message: 'Invalid JSON data' }, { status: 400 });
    }

    const supabase = createClient();

    const { data: __hist, error: __hist__err } = await supabase
        .from('history')
        .select('transaction_id')
        .eq('transaction_id', data?.eventData?.transactionReference)
        .single()

    if (__hist?.transaction_id) 
        return NextResponse.json({message: 'Transaction already processed.'}, {status: 400})
    
    const { data: user, error } = await supabase
        .from('profile')
        .select('id, email, created_at, wallet(balance)')
        .eq('email', data.eventData?.customer?.email)
        .single();

    if (error || !user) {
        return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
    }

    if (data.eventType === 'SUCCESSFUL_TRANSACTION') {
        const { data: wallet, error: walletError } = await supabase.from('wallet')
            .select('balance')
            .eq('user', user?.id)
            .single()

        if (walletError) return NextResponse.json({message: 'Getting wallet failed'}, { status: 500 })

        const walletBalance = wallet?.balance ?? 0

        const { data: walletUpdate, error: updateWalletError } = await supabase
            .from('wallet')
            .update({
                balance: walletBalance + data?.eventData?.amountPaid,
                meta_data: JSON.stringify(data?.eventData),
                updated_at: new Date().toISOString()
            })
            .eq('user', user.id)

        if (updateWalletError) {
            return NextResponse.json({message: 'Error updating wallet'}, {status: 500})
        }
        
        const success = await insertHistory(data, user.id, EVENT_TYPE.wallet_fund, 
            `Transferred ${formatNigerianNaira(data.eventData.amountPaid)} successfully to isubscribe wallet.`,
            data.eventData.paymentStatus);

        if (!success) return NextResponse.json({ message: 'Saving History data failed' }, { status: 500 });

        if (user) {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const isNewUser = new Date(user.created_at) > threeDaysAgo;

            if (isNewUser) {
                const { data: referral, error: referralError } = await supabase.from('referrals')
                    .select()
                    .eq('referred', user.id)
                    .single()
                
                if (referralError) {
                    console.error('Failed to fetch referral:', referralError)
                } else if (referral?.id && referral.status === 'pending') {
                    console.log("I count")
                    const { count, error: countError } = await supabase.from('history')
                        .select('*', { count: 'exact', head: true })
                        .eq('user', user.id)
                    
                    console.log("Count: ", count)

                    if (countError) {
                        console.error('Failed to get history count:', countError)
                    } else if (count === 1) {
                        const { error: updateError } = await supabase.from('referrals')
                            .update({ 
                                status: 'verified',
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', referral.id)

                        if (updateError) {
                            console.error('Failed to update referral status:', updateError)
                        }
                    }
                }
            }
        }

        const emailPromise = sendEmail({
            email: data.eventData.customer?.email,
            subject: 'Transfer successful',
            message: `Dear ${data.eventData.customer?.name},\n\nYour wallet has been credited with ${formatNigerianNaira(data.eventData.amountPaid)} successfully. This transaction was processed on ${new Date().toLocaleDateString()}.\n\nYour new wallet balance is ${walletBalance + data.eventData.amountPaid}.\n\nThank you for using our service.\n\nBest regards,\nTeam isubscribe.`,
        }).catch(error => {
            console.error('Failed to send email:', error);
        });
        
        return NextResponse.json({ message: 'Wallet credited successfully.' }, { status: 200 });
    }

    const failure = await insertHistory(data, user.id, EVENT_TYPE.wallet_fund_failed, 
        'Your attempt to fund your wallet was unsuccessful.',
        data.eventData.paymentStatus);

    if (!failure) return NextResponse.json({ message: 'Saving History data failed' }, { status: 500 });

    return NextResponse.json({ message: 'Wallet fund failed' }, { status: 400 });
};
