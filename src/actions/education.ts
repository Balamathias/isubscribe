import { EVENT_TYPE } from "@/utils/constants/EVENTS";
import { computeServerTransaction } from "./compute.server";
import { insertTransactionHistory, saveCashbackHistory } from "@/lib/supabase/history";
import { updateWallet } from "./utils";
import { buyEducation } from "@/lib/vtpass/services";
import { getUser } from "@/lib/supabase/accounts";
import { RESPONSE_CODES } from "@/utils/constants/response-codes";
import { PaymentMethod } from "@/types/networks";
import generateRequestId from "@/funcs/generateRequestId";

interface EducationPayload {
    cashBack?: number;
    variation_amount: number;
    method: PaymentMethod;
    mobileNumber: string;
    currentProvider: string;
    profileCode: string;
    isUTME?: boolean;
    educationAmount: number;
}

export const processEducation = async (payload: EducationPayload) => {
    try {
        const { data: profile } = await getUser();

        const billerPayload = {
            CashBack: payload?.cashBack,
            Price: payload?.variation_amount,
            method: payload?.method,
        };

        const requestPayload = {
            billersCode: payload.profileCode,
            phone: payload.mobileNumber,
            serviceID: payload.currentProvider === "jamb" ? "jamb" : "waec",
            variation_code:
                payload.currentProvider === "jamb"
                    ? payload.isUTME
                        ? "utme"
                        : "de"
                    : "waecdirect",
            amount: payload.educationAmount,
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

        const res = await buyEducation({
            ...requestPayload,
            request_id: generateRequestId(),
        });

        const metadata = {
            ...res,
            transId: res?.requestId,
            requestId: res?.requestId,
            profileCode: payload.profileCode,
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
                    extra: {
                        historyId: 
                    }
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
                    description: "Education subscription failed.",
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
    const [_, { data }] = await Promise.all([
        updateWallet(profileId, balance, cashbackBalance, deductableAmount),
        await insertTransactionHistory({
            description: `Education subscription for ${metadata.profileCode}`,
            status: "success",
            title: "Education Subscription",
            type: EVENT_TYPE.education_topup,
            email: null,
            meta_data: metadata,
            updated_at: null,
            user: profileId,
            amount: price,
        }),
        cashbackPrice && saveCashbackHistory({ amount: cashbackPrice }),
    ]);

    return data
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
            description: `Education subscription for ${metadata.profileCode}`,
            status: "pending",
            title: "Education Subscription",
            type: EVENT_TYPE.education_topup,
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
        title: "Education Subscription",
        type: EVENT_TYPE.education_topup,
        email: null,
        meta_data: metadata,
        updated_at: null,
        user: metadata.user,
        amount: price,
    });
};
