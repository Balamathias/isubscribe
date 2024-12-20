'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateWalletBalanceByUser } from '@/lib/supabase/wallets'
import { Tables } from '@/types/database'
import useWalletStore from '@/store/use-wallet-store'

interface WelcomeBonusModalProps {
    type?: 'basic' | 'premium',
    profile?: Tables<'profile'>,
    wallet?: Tables<'wallet'>,
}

const WelcomeBonusModal = ({ type = 'basic', profile, wallet }: WelcomeBonusModalProps) => {
    return <></>
}

export default WelcomeBonusModal