import React from 'react'
import { Card } from '../ui/card'
import { getAccount } from '@/lib/supabase/accounts'
import CopyButton from '../CopyButton'
import { LucideCalculator, PiggyBank } from 'lucide-react'
import GenerateAccount from './generate-account'

const FundWalletBox = async () => {
    const { data: account } = await getAccount()

    const accountName = `iSubscribe Network Technology.-${account?.account_name}`

  return (
    <div className='flex flex-col space-y-4 md:space-y-8'>
        {
            account ? (
                <div key={account.account_number} className='flex flex-col p-2 gap-y-6 items-center justify-center w-full'>
                    <div className='w-full bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-6 rounded-2xl shadow-xl relative overflow-hidden'>
                        <div className='absolute inset-0 opacity-10'>
                            <div className='absolute top-0 left-0 right-0 h-full w-full'
                                style={{
                                    backgroundImage: `
                                        radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0),
                                        linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)
                                    `,
                                    backgroundSize: '20px 20px, 40px 40px'
                                }}
                            />
                        </div>

                        <div className='relative z-10 text-white'>
                            <div className='flex items-center justify-between mb-8'>
                                <div className='h-10 w-10 rounded-full bg-white/20 flex items-center justify-center'>
                                    <LucideCalculator className='text-white' size={20} />
                                </div>
                                <div className='h-8 w-8 rounded-full bg-white/20 flex items-center justify-center'>
                                    <PiggyBank className='text-white' size={16} />
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='space-y-2'>
                                    <p className='text-xs text-white/70'>Account Number</p>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-xl font-bold tracking-wider'>{account?.account_number}</span>
                                        <CopyButton 
                                            iconOnly 
                                            className='hover:text-white/80' 
                                            content={account?.account_number!}
                                            iconClassName='text-primary/70 hover:text-primary'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <p className='text-xs text-white/70'>Bank Name</p>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold'>{account?.bank_name}</span>
                                        <CopyButton 
                                            iconOnly 
                                            className='hover:text-white/80'
                                            content={account?.bank_name!}
                                            iconClassName='text-primary/70 hover:text-primary'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <p className='text-xs text-white/70'>Account Name</p>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold'>{accountName}</span>
                                        <CopyButton 
                                            iconOnly 
                                            className='hover:text-white/80'
                                            content={accountName}
                                            iconClassName='text-primary/70 hover:text-primary'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4 text-center w-full'>
                        <p className='text-muted-foreground text-sm'>
                            Use your isubscribe account details above to fund your isubscribe wallet. Transfers usually take less than 5 seconds to arrive.
                        </p>
                        
                    </div>
                </div>
            ): (
                <GenerateAccount />
            )
        }

        <Card className='hidden justify-between object-cover bg-no-repeat bg-center gap-4 md:gap-7 bg-white dark:bg-card/80 rounded-xl shadow-none drop-shadow-none border-none p-4 md:py-6 items-start flex-col' id='more'>
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
