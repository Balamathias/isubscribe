import React from 'react'
import { Card } from '../ui/card'
import Link from 'next/link'
import { LucidePlus } from 'lucide-react'
import { CaretRightIcon } from '@radix-ui/react-icons'
import WalletBalance from './WalletBalance'
import { getWallet } from '@/lib/supabase/wallets'

const ActionBox = async () => {
    const { data: wallet } = await getWallet()
  return (
    <Card className='flex flex-row justify-between object-cover bg-no-repeat bg-center gap-4 md:gap-9 bg-gradient-to-r from-violet-700 via-violet-600 to-purple-800 md:min-w-[600px] text-white rounded-xl shadow-none drop-shadow-none border-none p-4 items-start'>
        <WalletBalance wallet={wallet!} />

        <div className='flex flex-col space-y-4 justify-end'>
            <Link href={'/dashboard/history'} className='text-xs tracking-tight text-violet-50 flex items-center space-x-1'>
                <span>Transaction History</span>
                <CaretRightIcon className='h-7 w-7' />
            </Link>

            <Link href={'/dashboard/fund-wallet'} className='text-xs tracking-tight text-violet-950 flex items-center space-x-1 bg-white p-2.5 rounded-full px-5 w-fit hover:bg-violet-100 hover:transition-all'>
                <LucidePlus size={18} />
                <span>Add Money</span>
            </Link>
        </div>
    </Card>
  )
}

export default ActionBox
