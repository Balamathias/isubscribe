import Status from "@/components/status"
import { DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils"
import { Tables } from "@/types/database"
import React from "react"

interface CashbackHistoryProps {
    history: Tables<'history'>
}

const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
}
const CashbackHistory = async ({ history }: CashbackHistoryProps) => {
    return (
        <div className="flex flex-col gap-y-2 py-6 px-3 md:px-5 rounded-2xl bg-card/70">
            <div className="flex mx-auto py-4">
                <Status status={history.status as Status} type="icon" />
            </div>

            <div className="flex flex-col gap-y-3">
                {
                    Object.entries(history)
                        .filter(([key, value]) => {
                            if (value === null) return false;
                            if (key === 'user' || key === 'meta_data') return false;
                            if (/^[0-9a-fA-F-]{36}$/.test(String(value))) return false;
                            return true;
                        })
                        .map(([key, value], idx) => {
                            let formattedValue = value;

                            if (typeof value === 'string' && !isNaN(Date.parse(value))) {
                                formattedValue = formatDate(value);
                            }

                            if (key.toLocaleLowerCase() === 'cashback') {
                                key = 'Data Bonus'
                            }

                            if ((String(value)).toLocaleLowerCase() === 'cashback') {
                                formattedValue = ('Data Bonus')
                            }

                            if (typeof value === 'number' && key.toLowerCase().includes('amount')) {
                                formattedValue = formatDataAmount(value * DATA_MB_PER_NAIRA);
                            }

                            formattedValue = JSON.stringify(formattedValue?.toString()?.replace(/cashback/i, 'Data bonus'))

                            return (
                                <div className="flex flex-row justify-between" key={idx}>
                                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}</span>
                                    <span>{JSON.parse(formattedValue)}</span>
                                </div>
                            );
                        })
                }
            </div>
        </div>
    )
}

export default CashbackHistory;
