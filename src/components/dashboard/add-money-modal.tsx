import React from 'react'
import DynamicModal from '../DynamicModal'
import { LucideCalculator, LucidePiggyBank, LucidePlus, LucideUser, LucideUser2, PiggyBank } from 'lucide-react'
import { Button } from '../ui/button'
import { getAccount } from '@/lib/supabase/accounts'
import Link from 'next/link'
import CopyButton from '../CopyButton'

const AddmoneyModal = async () => {

  const { data: account } = await getAccount()

  return (
    <div>
        <DynamicModal
            trigger={
                <Button className='text-xs tracking-tighter text-violet-950 flex items-center space-x-1 bg-white md:p-2.5 py-1.5 px-3 rounded-full md:px-5 w-fit hover:bg-violet-100 hover:transition-all'>
                    <LucidePlus size={18} />
                    <span>Add Money</span>
                </Button>
            }
        >
            <div className='flex flex-col py-2 gap-y-3 items-center justify-center text-center w-full'>
                <div className='h-10 w-10 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
                    <LucidePiggyBank size={15} />
                </div>
                <h2 className='text-base tracking-tighter'>Fund your wallet.</h2>
                <div className='flex flex-col gap-y-4'>

                    <div className='flex flex-col gap-y-1.5 items-center justify-center'>
                        <div className='flex flex-row items-center gap-x-1.5'>
                            <div className='h-8 w-8 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
                                <LucideCalculator size={14} />
                            </div>
                            <p className='text-muted-foreground font-semibold'>Account Number</p>
                        </div>
                        <div className='flex gap-x-0.5 items-center'>
                            <h2 className='text-lg font-semibold'>{account.account_number}</h2>
                            <CopyButton iconOnly className='bg-transparent text-inherit !p-0.5' content={account.account_number!} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-1.5 items-center justify-center'>
                        <div className='flex flex-row items-center gap-x-1.5'>
                            <div className='h-8 w-8 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
                                <PiggyBank size={14} />
                            </div>
                            <p className='text-muted-foreground font-semibold'>Bank Name</p>
                        </div>
                        <div className='flex gap-x-0.5 items-center'>
                            <h2 className='text-lg font-semibold'>{account.bank_name}</h2>
                            <CopyButton iconOnly className='bg-transparent text-inherit !p-0.5' content={account.bank_name!} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-1.5 items-center justify-center'>
                        <div className='flex flex-row items-center gap-x-1.5'>
                            <div className='h-8 w-8 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
                                <LucideUser2 size={14} />
                            </div>
                            <p className='text-muted-foreground font-semibold'>Account Name</p>
                        </div>
                        <div className='flex gap-x-0.5 items-center'>
                            <h2 className='text-lg font-semibold'>{account.account_name}</h2>
                            <CopyButton iconOnly className='bg-transparent text-inherit !p-0.5' content={account.account_name!} />
                        </div>
                    </div>

                    <div className=''>
                        <Button asChild className='rounded-full' variant={'link'}>
                            <Link href={`/dashboard/fund-wallet#more`}>
                                Learn more.
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </DynamicModal>
    </div>
  )
}

export default AddmoneyModal