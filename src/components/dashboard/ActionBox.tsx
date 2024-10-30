import React from 'react'
import { Card } from '../ui/card'
import WalletBalance from './WalletBalance'
import { getWallet } from '@/lib/supabase/wallets'
import FundClaimCrumb from './fund-claim-crumb'

const ActionBox = async () => {
    const { data: wallet, error } = await getWallet()
  return (
    <Card className='flex flex-col justify-between object-cover bg-no-repeat bg-center gap-4 md:gap-9 bg-gradient-to-r from-violet-900 via-violet-800 to-purple-800 md:min-w-[600px] text-white rounded-xl shadow-none drop-shadow-none border-none p-4 items-start'>
        <WalletBalance wallet={wallet!} />

        <FundClaimCrumb wallet={wallet!} />
    </Card>
  )
}

export default ActionBox
