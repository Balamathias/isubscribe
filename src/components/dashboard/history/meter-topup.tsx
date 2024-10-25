import React from 'react'
import { motion } from 'framer-motion'
import Status from "@/components/status"
import { Card } from "@/components/ui/card"
import { formatNigerianNaira } from "@/funcs/formatCurrency"
import { formatDateTime } from "@/funcs/formatDate"
import type { Status as StatusType } from "@/types/constants"
import { Tables } from "@/types/database"

interface MeterTopupMetadata {
    meterNumber: string
    disco: string // Distribution company
    meterType: 'Prepaid' | 'Postpaid'
    units?: string // For prepaid meters
}

interface MeterTopupProps {
    data?: MeterTopupMetadata
    history: Tables<'history'>
}

const MeterTopup: React.FC<MeterTopupProps> = ({ data, history }) => {
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
                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 rounded-xl flex flex-col justify-center items-center w-full gap-y-3'>
                    <Status type="icon" status={history.status as StatusType} />
                    <h2 className='text-lg font-semibold'>{formatNigerianNaira(history?.amount ?? 0)}</h2>
                    <h2 className='text-xl text-muted-foreground font-semibold text-center'>{history.title}</h2>
                    <p className='text-muted-foreground text-xs md:text-sm text-center'>{history?.description}</p>
                    <p className='text-muted-foreground text-xs md:text-sm text-center'>{formatDateTime(history?.created_at)}</p>
                </Card>

                <Card className='dark:bg-card/80 shadow-none drop-shadow-none border-none p-4 text-xs md:text-sm tracking-tighter rounded-xl flex flex-col w-full gap-y-6'>
                    <h2 className='text-base font-semibold tracking-tighter'>Transaction Details</h2>

                    <motion.div className='flex items-start justify-between' variants={itemVariants}>
                        <p className='text-muted-foreground basis-2/3'>Meter Number</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.meterNumber}</p>
                        </div>
                    </motion.div>

                    <motion.div className='flex items-start justify-between' variants={itemVariants}>
                        <p className='text-muted-foreground basis-2/3'>Distribution Company</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.disco}</p>
                        </div>
                    </motion.div>

                    <motion.div className='flex items-start justify-between' variants={itemVariants}>
                        <p className='text-muted-foreground basis-2/3'>Meter Type</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{data?.meterType}</p>
                        </div>
                    </motion.div>

                    {data?.meterType === 'Prepaid' && data?.units && (
                        <motion.div className='flex items-start justify-between' variants={itemVariants}>
                            <p className='text-muted-foreground basis-2/3'>Units Purchased</p>
                            <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                                <p>{data?.units}</p>
                            </div>
                        </motion.div>
                    )}

                    <motion.div className='flex items-start justify-between' variants={itemVariants}>
                        <p className='text-muted-foreground basis-2/3'>Amount</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{formatNigerianNaira(history?.amount ?? 0)}</p>
                        </div>
                    </motion.div>

                    <motion.div className='flex items-start justify-between' variants={itemVariants}>
                        <p className='text-muted-foreground basis-2/3'>Transaction ID</p>
                        <div className='flex flex-col space-y-1 justify-start basis-1/3'>
                            <p>{history?.id}</p>
                        </div>
                    </motion.div>

                    <motion.div className='flex items-start justify-between' variants={itemVariants}>
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

export default MeterTopup
