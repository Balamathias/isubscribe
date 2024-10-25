import React from "react"
import { motion } from "framer-motion"
import Status from "@/components/status"
import { Card } from "@/components/ui/card"
import { formatNigerianNaira } from "@/funcs/formatCurrency"
import { formatDateTime } from "@/funcs/formatDate"
import { Tables } from "@/types/database"
import { DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils"
import type { Status as StatusType } from "@/types/constants"

interface CashbackHistoryProps {
    history: Tables<'history'>
}

const CashbackHistory = ({ history }: CashbackHistoryProps) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <motion.div 
            className="flex flex-col gap-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className='flex flex-col space-y-8 w-full'>
                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 py-6 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                    <Status type="icon" status={history.status as StatusType} />
                    <h2 className='text-lg font-semibold'>{formatDataAmount(history?.amount! * DATA_MB_PER_NAIRA)}</h2>
                    <h2 className='text-xl text-muted-foreground font-semibold text-center'>Data Bonus</h2>
                    <p className='text-muted-foreground text-xs md:text-sm text-center'>{history?.description?.replace(/cashback/i, 'Data bonus')}</p>
                    <p className='text-muted-foreground text-xs md:text-sm text-center'>{formatDateTime(history?.created_at)}</p>
                </Card>

                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                    <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                    {Object.entries(history)
                        .filter(([key, value]) => {
                            if (value === null) return false;
                            if (key === 'user' || key === 'meta_data') return false;
                            if (/^[0-9a-fA-F-]{36}$/.test(String(value))) return false;
                            return true;
                        })
                        .map(([key, value], idx) => {
                            let formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            let formattedValue = value;

                            if (typeof value === 'string' && !isNaN(Date.parse(value))) {
                                formattedValue = formatDateTime(value);
                            }

                            if (key.toLowerCase() === 'cashback') {
                                formattedKey = 'Data Bonus';
                                formattedValue = formatDataAmount(Number(value) * DATA_MB_PER_NAIRA);
                            }

                            if (typeof value === 'number' && key.toLowerCase().includes('amount')) {
                                formattedValue = formatNigerianNaira(value);
                            }

                            return (
                                <motion.div 
                                    className='flex items-start justify-between' 
                                    key={idx}
                                    variants={itemVariants}
                                >
                                    <p className='text-muted-foreground basis-2/3'>{formattedKey}</p>
                                    <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                                        <p>{String(formattedValue).replace(/cashback/i, 'Data bonus')}</p>
                                    </div>
                                </motion.div>
                            );
                        })
                    }

                    <motion.div 
                        className='flex items-start justify-between'
                        variants={itemVariants}
                    >
                        <p className='text-muted-foreground basis-2/3'>Status</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <Status status={history.status as StatusType} />
                        </div>
                    </motion.div>
                </Card>
            </div>
        </motion.div>
    )
}

export default CashbackHistory;
