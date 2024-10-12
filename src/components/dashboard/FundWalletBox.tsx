import React from 'react'
import { Card } from '../ui/card'
import { getAccount } from '@/lib/supabase/accounts'
import CopyButton from '../CopyButton'

const FundWalletBox = async () => {
    const { data: account } = await getAccount()
  return (
    <div className='flex flex-col space-y-4 md:space-y-8'>
        <Card className='flex flex-row justify-between object-cover bg-no-repeat bg-center gap-4 md:gap-9 bg-gradient-to-r from-violet-900 via-violet-800 to-purple-800 md:min-w-[600px] text-white rounded-xl shadow-none drop-shadow-none border-none p-4 items-start'>
            <div className='flex flex-col space-y-2.5'>
                <div className='flex-col space-y-0.5'>
                    <p className="text-xs sm:text-sm tracking-tighter text-violet-50">Your Account Number</p>
                    <h2 className='tracking-wider text-lg md:text-2xl font-bold'>{account?.account_number}</h2>
                </div>
                <div className='flex-col space-y-0.5'>
                    <p className="text-xs sm:text-sm tracking-tighter text-violet-50">Bank Name</p>
                    <h2 className='tracking-wider text-lg md:text-2xl font-bold'>{account?.bank_name}</h2>
                </div>
            </div>

            <div className='flex flex-col space-y-4 justify-end'>

                <CopyButton content={account?.account_number!} />

                <div className='flex-col space-y-0.5'>
                    <p className="text-xs sm:text-sm tracking-tighter text-violet-50">Account Name</p>
                    <h2 className='tracking-wider text-lg md:text-2xl font-bold'>{account?.account_name}</h2>
                </div>
            </div>
        </Card>

        <Card className='flex justify-between object-cover bg-no-repeat bg-center gap-4 md:gap-7 bg-white dark:bg-card/80 rounded-xl shadow-none drop-shadow-none border-none p-4 md:py-6 items-start flex-col'>
        <div className='flex flex-col space-y-2.5'>
            <h2 className='text-muted-foreground text-md font-semibold'>Add money via Bank Transfer in just three steps</h2>
        </div>

        <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
            <li className='text-muted-foreground text-xs sm:text-sm'>
                Copy the account number above - {account?.account_number} is your iSubscribe account number.
            </li>
            <li className='text-muted-foreground text-xs sm:text-sm'>
                Open the bank app you want to transfer money from, and add the account number above as a beneficiary.
            </li>
            <li className='text-muted-foreground text-xs sm:text-sm'>
                Transfer the amount you want to add to your wallet to the account number above. You will automatically receive the money in your wallet.
            </li>
        </ul>
    </Card>
    </div>
  )
}

export default FundWalletBox
