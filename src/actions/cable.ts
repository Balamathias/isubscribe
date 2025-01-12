import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import { computeServerTransaction } from "./compute.server";

import { insertTransactionHistory, saveCashbackHistory } from "@/lib/supabase/history";

import { updateWallet } from "./utils";
import { buyTvCable } from "@/lib/vtpass/services";
import { getUser } from "@/lib/supabase/accounts";
import { RESPONSE_CODES } from "@/utils/constants/response-codes";
import { PaymentMethod } from "@/types/networks";
import generateRequestId from "@/funcs/generateRequestId";

interface CablePayload {
    cashBack?: number;
    variation_amount: number;
    method: PaymentMethod;
    smartcardNumber: string;
    mobileNumber: string;
    currentProvider: string;
    variation_code: string;
    subscription_type?: 'Renew' | 'Change'
}

export const processCable = async (payload: CablePayload) => {
    try {
        const { data: profile } = await getUser();

        const billerPayload = {
            CashBack: payload?.cashBack,
            Price: payload?.variation_amount,
            method: payload?.method,
        };

        const requestPayload = {
            billersCode: payload.smartcardNumber,
            phone: payload.mobileNumber,
            subscription_type: payload?.subscription_type ?? "Renew",
            serviceID: payload.currentProvider,
            variation_code: payload.variation_code,
            amount: payload.variation_amount,
        };

        const { error: computeError, data: computeData } = await computeServerTransaction({
            payload: {
                cashback: 0,
                price: billerPayload.Price,
                method: billerPayload.method,
            },
        });

        if (computeError || !computeData) {
            return {
                error: { message: computeError || "Transaction computation failed." },
                data: null,
            };
        }

        const { balance, cashbackBalance, cashbackPrice, deductableAmount, price } = computeData;

        const res = await buyTvCable({
            ...requestPayload,
            request_id: generateRequestId(),
        });

        const metadata = {
            ...res,
            transId: res?.requestId,
            requestId: res?.requestId,
            smartcardNumber: payload.smartcardNumber,
            provider: payload.currentProvider,
        };

        switch (res?.code) {
            case RESPONSE_CODES.TRANSACTION_SUCCESSFUL.code:
                await handleSuccessCase({
                    profileId: profile?.id!,
                    metadata,
                    price,
                    balance,
                    cashbackBalance,
                    cashbackPrice,
                    deductableAmount,
                });
                return {
                    data: {
                        message: RESPONSE_CODES.TRANSACTION_SUCCESSFUL.message,
                        status: "success",
                    },
                    error: null,
                };

            case RESPONSE_CODES.TRANSACTION_PENDING.code:
                await handlePendingCase({
                    profileId: profile?.id!,
                    metadata,
                    price,
                    balance,
                    cashbackBalance,
                    cashbackPrice,
                    deductableAmount,
                });
                return {
                    data: {
                        message: RESPONSE_CODES.TRANSACTION_PENDING.message,
                        status: "pending",
                    },
                    error: null,
                };

            case RESPONSE_CODES.TRANSACTION_FAILED.code:
            default:
                await handleErrorCase({
                    metadata,
                    price,
                    description: "Cable subscription failed.",
                });
                return {
                    error: { message: "Transaction attempt failed. Please try again." },
                    data: null,
                };
        }
    } catch (error: any) {
        console.error(error);
        return {
            error: { message: error?.message || "An unknown error occurred. Please try again." },
            data: null,
        };
    }
};

const handleSuccessCase = async ({
    profileId,
    metadata,
    price,
    balance,
    cashbackBalance,
    cashbackPrice,
    deductableAmount,
}: any) => {
    await Promise.all([
        updateWallet(profileId, balance, cashbackBalance, deductableAmount),
        insertTransactionHistory({
            description: `Cable subscription for ${metadata.smartcardNumber}`,
            status: "success",
            title: "TV Subscription",
            type: EVENT_TYPE.tv_topup,
            email: null,
            meta_data: metadata,
            updated_at: null,
            user: profileId,
            amount: price,
        }),
        cashbackPrice && saveCashbackHistory({ amount: cashbackPrice }),
    ]);
};

const handlePendingCase = async ({
    profileId,
    metadata,
    price,
    balance,
    cashbackBalance,
    cashbackPrice,
    deductableAmount,
}: any) => {
    await Promise.all([
        updateWallet(profileId, balance, cashbackBalance, deductableAmount),
        insertTransactionHistory({
            description: `Cable subscription for ${metadata.smartcardNumber}`,
            status: "pending",
            title: "TV Subscription",
            type: EVENT_TYPE.tv_topup,
            email: null,
            meta_data: metadata,
            updated_at: null,
            user: profileId,
            amount: price,
        }),
        cashbackPrice && saveCashbackHistory({ amount: cashbackPrice }),
    ]);
};

const handleErrorCase = async ({ metadata, price, description }: any) => {
    await insertTransactionHistory({
        description,
        status: "failed",
        title: "TV Subscription",
        type: EVENT_TYPE.tv_topup,
        email: null,
        meta_data: metadata,
        updated_at: null,
        user: metadata.user,
        amount: price,
    });
};
