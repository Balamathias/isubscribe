import { TransactionUpdate } from "@/@types/webhooks"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const POST = async (req: Request, res: Response) => {

    const supabase = createClient()

    let response: TransactionUpdate;

    try {
        response = await req.json();
    } catch (err) {
        return NextResponse.json({ response: "error", message: "Invalid JSON payload" }, { status: 400 });
    }

    if (response.type === 'transaction-update') {
        switch (response.data.content.transactions.status) {

            case 'delivered':

                const { data: transaction, error } = await supabase.from(`history`)
                    .select(`status, id, profile (email, full_name)`)
                    .eq('request_id', response.data.requestId)
                    .single()

                console.error(error)

                if (transaction && transaction?.status === 'pending') {
                    await supabase.from('history')
                        .update({ status: 'success', updated_at: new Date().toISOString(), description: response.data.response_description })
                        .eq('id', transaction?.id)

                    if (transaction?.profile?.email)
                        resend.emails.send({
                            from: `isubscribe <service@updates.isubscribe.ng>`,
                            to: [transaction?.profile?.email],
                            subject: "Transaction delivered",
                            text: `Hello ${transaction?.profile?.full_name}\n\nWe trust this email finds you well.\n\nWe are pleased to inform you that your pending transaction has been delivered.\n\nDetails:\nProduct Name: ${response.data.content.transactions.product_name}\nPhone Number: ${response.data.content.transactions.phone}\nUnit Price: ${response.data.content.transactions.unit_price}\nQuantity: ${response.data.content.transactions.quantity}\nTotal Amount: ${response.data.content.transactions.total_amount}\nTransaction ID: ${response.data.content.transactions.transactionId}`
                        })
                    return NextResponse.json({ response: 'success' }, { status: 200 })
                }

            case 'reversed':

                const { data: _transaction, error: _error } = await supabase.from(`history`)
                    .select(`status, id, profile (email, full_name, id)`)
                    .eq('request_id', response.data.requestId)
                    .single()

                console.error(_error)

                if (_transaction && _transaction?.status === 'pending') {
                    await supabase.from('history')
                        .update({ status: 'reversed', updated_at: new Date().toISOString(), description: response.data.response_description })
                        .eq('id', _transaction?.id)

                    const { data: walletData, error: walletError } = await supabase.from('wallet')
                        .select('balance')
                        .eq('user', _transaction?.profile?.id!)
                        .single();

                    if (walletError) {
                        console.error(walletError);
                        return NextResponse.json({ 'response': 'error', 'message': 'Failed to retrieve wallet balance' }, { status: 500 });
                    }

                    const newBalance = Math.max(((walletData?.balance || 0) + Number(response.data.amount)), 0);

                    const { error: updateError } = await supabase.from('wallet')
                        .update({ balance: newBalance })
                        .eq('user', _transaction?.profile?.id!);

                    if (updateError) {
                        console.error(updateError);
                        return NextResponse.json({ 'response': 'error', 'message': 'Failed to update wallet balance' }, { status: 500 });
                    }

                    if (_transaction?.profile?.email) {
                        resend.emails.send({
                            from: `isubscribe <service@updates.isubscribe.ng>`,
                            to: [_transaction?.profile?.email],
                            subject: "Transaction Reversed",
                            text: `Hello ${_transaction?.profile?.full_name}\n\nWe regret to inform you that your transaction has been reversed and your wallet has been refunded.\n\nDetails:\nProduct Name: ${response.data.content.transactions.product_name}\nPhone Number: ${response.data.content.transactions.phone}\nUnit Price: ${response.data.content.transactions.unit_price}\nQuantity: ${response.data.content.transactions.quantity}\nTotal Amount: ${response.data.content.transactions.total_amount}\nTransaction ID: ${response.data.content.transactions.transactionId}. \n\nThanks for choosing isubscribe!`
                        })
                    }
                    return NextResponse.json({ response: 'success' }, { status: 200 })
                }

            default:
                console.debug('Unhandled case: ' + response.type)
        }
    }
}