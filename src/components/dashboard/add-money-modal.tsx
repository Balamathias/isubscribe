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
                >
                    {
                        account ? (
                            <div className='flex flex-col py-2 gap-y-3 items-center justify-center text-center w-full !bg-inherit/70 backdrop:blur-lg'>
                                
                                <div className='flex flex-col gap-y-4'>
                                    <div className='flex flex-col gap-y-1.5 items-center justify-center'>
                                        <div className='flex flex-row items-center gap-x-1.5'>
                                            <div className='h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-primary'>
                                                <LucideCalculator size={14} />
                                            </div>
                                            <p className='text-muted-foreground font-semibold'>Account Number</p>
                                        </div>
                                        <div className='flex gap-x-0.5 items-center'>
                                            <h2 className='text-xl font-semibold'>{account?.account_number}</h2>
                                            <CopyButton iconOnly className='bg-transparent text-inherit !p-0.5' content={account?.account_number!} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-1.5 items-center justify-center'>
                                        <div className='flex flex-row items-center gap-x-1.5'>
                                            <div className='h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-primary'>
                                                <PiggyBank size={14} />
                                            </div>
                                            <p className='text-muted-foreground font-semibold'>Bank Name</p>
                                        </div>
                                        <div className='flex gap-x-0.5 items-center'>
                                            <h2 className='text-lg font-semibold'>{account?.bank_name}</h2>
                                            <CopyButton iconOnly className='bg-transparent text-inherit !p-0.5' content={account?.bank_name!} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-1.5 items-center justify-center'>
                                        <div className='flex flex-row items-center gap-x-1.5'>
                                            <div className='h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-primary'>
                                                <LucideUser2 size={14} />
                                            </div>
                                            <p className='text-muted-foreground font-semibold'>Account Name</p>
                                        </div>
                                        <div className='flex gap-x-0.5 items-center'>
                                            <h2 className='text-lg font-semibold'>{account?.account_name}</h2>
                                            <CopyButton iconOnly className='bg-transparent text-inherit !p-0.5' content={account?.account_name!} />
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-y-2'>
                                        <p className='text-muted-foreground text-sm flex flex-wrap items-center gap-x-1.5'>
                                            <LucideInfo size={14} />{' '}Use your isubscribe account details above to fund your isubscribe wallet-Tranfers usually take less than 10 seconds to arrive.
                                        </p>
                                        <Button asChild className='rounded-full' variant={'link'}>
                                            <Link href={`/dashboard/fund-wallet#more`} className='bg-gradient-to-r from-violet-500 to-pink-500 dark:from-violet-400 dark:to-pink-400 text-transparent bg-clip-text font-semibold'>
                                                Learn more.
                                            </Link>
                                        </Button>
                                    </div>
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