import React from 'react'
import DynamicModal from '../DynamicModal'
import { LucideCalculator, LucideInfo, LucidePiggyBank, LucidePlus, LucideUser, LucideUser2, PiggyBank } from 'lucide-react'
import { Button } from '../ui/button'
import { getAccount } from '@/lib/supabase/accounts'
import Link from 'next/link'
import CopyButton from '../CopyButton'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import PleaseSignIn from './please-sign-in.modal'
import GenerateAccount from './generate-account'

const AddmoneyModal = async () => {

    const {data: { user }} = await getCurrentUser()
    const { data: account, error } = await getAccount()

    const accountName = `iSubscribe Network Technology.-${account?.account_name}`

  return (
    <div>
        {
            user ? (
                <DynamicModal
                    trigger={
                        <Button className='text-xs tracking-tighter text-violet-950 flex items-center space-x-1 bg-white md:p-2.5 py-1.5 px-3 rounded-full md:px-5 w-fit hover:bg-violet-100 hover:transition-all'>
                            <LucidePlus size={18} />
                            <span>Fund Wallet</span>
                        </Button>
                    }
                    title="Zero Fees on Funding wallet."
                    drawerClassName='max-h-[90vh] overflow-y-auto'
                    dialogOnly
                    dialogClassName='max-sm:!max-w-[90vw] rounded-3xl'
                >
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
                                        Use your isubscribe account details above to fund your isubscribe wallet. Transfers usually take less than 10 seconds to arrive.
                                    </p>
                                    <Button asChild className='rounded-full w-full' variant={'link'}>
                                        <Link href={`/dashboard/fund-wallet#more`} className='bg-gradient-to-r from-violet-500 to-pink-500 dark:from-violet-400 dark:to-pink-400 text-transparent bg-clip-text font-semibold'>
                                            Learn more about wallet funding
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ): (
                            <GenerateAccount />
                        )
                    }
                </DynamicModal>
            ): (
                <PleaseSignIn
                    message='Please sign in to fund your wallet.'
                    trigger={
                        <Button className='text-xs tracking-tighter text-violet-950 flex items-center space-x-1 bg-white md:p-2.5 py-1.5 px-3 rounded-full md:px-5 w-fit hover:bg-violet-100 hover:transition-all'>
                            <LucidePlus size={18} />
                            <span>Fund Wallet</span>
                        </Button>
                    }
                />
            )
        }
    </div>
  )
}

export default AddmoneyModal