"use client"

import { Button } from '@/components/ui/button'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { DATA_MB_PER_NAIRA, formatDataAmount } from '@/lib/utils'
import useWalletStore from '@/store/use-wallet-store'
import { Tables } from '@/types/database'
import { createClient } from '@/utils/supabase/client'
import { Asterisk, Eye, EyeOff } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const WalletBalance = ({ wallet }: { wallet: Tables<'wallet'>}) => {
    const [hideBalance, setHideBalance] = useState(localStorage.getItem('hideBalance') === 'true' || false)
    const [hideCashbackBalance, setHideCashbackBalance] = useState(localStorage.getItem('hideCashbackBalance') === 'true' || false)


    const setWalletBalance = useWalletStore(state => state.setBalance)
    const walletBalance = useWalletStore(state => state.balance)

    useEffect(() => { setWalletBalance(wallet?.balance ?? 0) }, [wallet?.balance, setWalletBalance])

    const cashbackBalance = wallet?.cashback_balance?.toFixed(2) || "0.00"

    const handleToggleHideBalance  = () => {
        setHideBalance(!hideBalance)
        localStorage.setItem('hideBalance', JSON.stringify(!hideBalance))
    }
    const handleToggleHideCashbackBalance  = () => {
        setHideCashbackBalance(!hideCashbackBalance)
        localStorage.setItem('hideCashbackBalance', JSON.stringify(!hideCashbackBalance))
    }

    useEffect(() => {
        const supabase = createClient()

        const walletChannel = supabase.channel('wallet-update-channel')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'wallet', filter: `user=eq.${wallet?.user}` },
            (payload) => {
                if (payload.new) {
                    const response = payload?.new as Tables<'wallet'>
                    setWalletBalance(response.balance ?? 0)
                    
                    if (response.balance! > wallet?.balance!) {
                        toast.success('Wallet funded successfully.')
                        const audio = new Audio('/audio/notification.wav')
                        audio.play()
                    }
                }
            }
        )
        .subscribe()

        return () => { supabase.removeChannel(walletChannel) }
    }, [wallet?.user, wallet?.balance])

  return (
    <div className=' flex flex-row justify-between w-full items-center'>
        <RevealBalance
            balance={walletBalance?.toFixed(2)}
            hide={hideBalance}
            title='Wallet Balance'
            toggleShow={handleToggleHideBalance}
        />
        <RevealBalance
            balance={(cashbackBalance)}
            hide={hideCashbackBalance}
            title='Data Bonus'
            toggleShow={handleToggleHideCashbackBalance}
            type="data-bonus"
        />
    </div>
  )
}

const RevealBalance = ({balance, hide, title, toggleShow, type="balance"}: { 
    balance: string, hide: boolean, toggleShow: () => void, title: string
    type?: "data-bonus" | "balance" | null
}) => {

    return (
        <div>
            <p className='tracking-tight text-white text-xs md:text-sm'>{title}</p>
            <div className=' flex flex-row items-center justify-center'>
            {
                hide ? 
                (
                <div className='flex flex-row items-center justify-center'>
                    {
                        Array.from({length: 4}).map((_, idx) => (
                            <Asterisk key={idx} size={18} className='text-white' />
                        ))
                    }
                </div>
                ) :
                (
                    <h1 className='md:text-lg text-base tracking-tight md:tracking-normal font-semibold'>{type === 'balance' ? (formatNigerianNaira(parseFloat(balance))): formatDataAmount(parseFloat(balance) * DATA_MB_PER_NAIRA)}</h1>
                )
            }
            <Button className={"p-1 h-8 bg-transparent hover:bg-transparent w-9 shadow-none drop-shadow-none border-none"} onClick={toggleShow}>
                {
                    hide ? <EyeOff size={16} /> : <Eye size={17.5} />
                }
            </Button>
            </div>
        </div>
    )
}

export default WalletBalance