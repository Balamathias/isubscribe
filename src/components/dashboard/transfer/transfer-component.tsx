'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { StyledInput } from "@/components/ui/styled-input"
import { User2, Wallet, ArrowRight, AlertCircle } from "lucide-react"
import { useDebouncedCallback } from 'use-debounce'
import { searchAccounts } from '@/lib/actions/search-accounts'
import { Tables } from '@/types/database'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { formatNigerianNaira } from '@/funcs/formatCurrency'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import DynamicModal from '@/components/DynamicModal'
import ConfirmPin from '../ConfirmPin'
import LoadingSpinner from '@/components/loaders/LoadingSpinner'
import { useSendMoney } from '@/lib/react-query/funcs/transfer'
import Confetti from 'react-confetti';
import { LucideCheckCircle } from 'lucide-react';

const MIN_AMOUNT = 10
const MAX_AMOUNT = 1000000

interface TransferComponentProps {
    wallet: Tables<'wallet'> | null
}

const TransferComponent = ({ wallet }: TransferComponentProps) => {
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [searching, setSearching] = useState(false)
  const [account, setAccount] = useState<Tables<'account'> & { profile?: Tables<'profile'> | null } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proceed, setProceed] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [success, setSuccess] = useState(false)
  const [confettiShown, setConfettiShown] = useState(false);

  const { mutateAsync: sendMoney, isPending: transferring, data } = useSendMoney()

  useEffect(() => {
    if (success && !confettiShown) {
      setConfettiShown(true);
    }
  }, [success, confettiShown]);

  const searchAccount = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setAccount(null)
      setError(null)
      return
    }

    try {
      setSearching(true)
      setError(null)
      
      const { data, error } = await searchAccounts(query)
      
      if (error) {
        setError(error)
        toast.error(error)
        return
      }

      if (data && data[0]) {
        setAccount(data[0])
      } else {
        setAccount(null)
        setError('No account found')
      }
    } catch (err) {
      setError('Failed to search account')
      toast.error('Failed to search account')
    } finally {
      setSearching(false)
    }
  }, 500)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAccountNumber(value)
    searchAccount(value)
  }, [searchAccount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers
    if (!/^\d*$/.test(value)) return
    setAmount(value)
  }

  const validateAmount = (amount: string): boolean => {
    const numAmount = Number(amount)
    if (isNaN(numAmount)) {
      toast.error('Please enter a valid amount')
      return false
    }
    if (numAmount < MIN_AMOUNT) {
      toast.error(`Minimum transfer amount is ${formatNigerianNaira(MIN_AMOUNT)}`)
      return false
    }
    if (numAmount > MAX_AMOUNT) {
      toast.error(`Maximum transfer amount is ${formatNigerianNaira(MAX_AMOUNT)}`)
      return false
    }
    return true
  }

  const isInsufficientFunds = useCallback(() => {
    const numAmount = Number(amount)
    return !wallet?.balance || numAmount > wallet.balance
  }, [amount, wallet?.balance])

  const handleSubmit = async () => {
    if (!account) {
      toast.error('Please select a valid recipient')
      return
    }

    if (!validateAmount(amount)) {
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    // setShowConfirmation(false)
    setProceed(true)
  }

  const handleTransfer = async () => {
    setProceed(false)
    await sendMoney({ amount: Number(amount), accountNumber: accountNumber }, {
      onSuccess: () => {
        setSuccess(true)
        setAccountNumber('')
        setShowConfirmation(false)
        toast.success(`You have successfully transferred ${formatNigerianNaira(Number(amount))} to ${account?.profile?.full_name}`)
      }
    })
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Enter recipient&apos;s isubscribe account number</p>
      </div>

      <StyledInput 
        icon={User2}
        placeholder="Enter account number..." 
        value={accountNumber}
        onChange={handleInputChange}
        error={!!error}
        name='account_number'
        className='bg-white dark:bg-secondary/50'
      />

      {searching && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Searching...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {account && (
        <Card className="p-4 space-y-2 dark:bg-secondary/50">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {account?.profile?.full_name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{account?.profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{account.account_number}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Enter amount to transfer</p>
        <StyledInput 
          icon={Wallet}
          placeholder={`Amount (${formatNigerianNaira(MIN_AMOUNT)} - ${formatNigerianNaira(MAX_AMOUNT)})`}
          value={amount}
          onChange={handleAmountChange}
          type="text"
          inputMode="numeric"
          name='amount'
          className='bg-white dark:bg-secondary/50'
        />
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={!account || !amount || isSubmitting || transferring}
        className="w-full h-12 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Transfer Funds'}
      </Button>

      <DynamicModal
        open={showConfirmation}
        setOpen={transferring ? undefined : setShowConfirmation}
        dialogClassName={'sm:max-w-md dark:bg-card'}
        drawerClassName="dark:bg-card"
      >
        {transferring && 
          <LoadingSpinner isPending={transferring} />
        }
        <Card className="border-none shadow-none">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-2">
              <div className="h-12 w-12 mx-auto rounded-full flex items-center justify-center bg-violet-600/20 text-violet-600">
                <ArrowRight size={20} />
              </div>
              <h2 className="text-xl font-medium text-primary dark:text-violet-400">Transfer Details</h2>
            </div>

            {/* Details Section */}
            <div className="space-y-4 bg-secondary/50 rounded-xl p-4">
              {/* Recipient Info */}
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sending to</p>
                  <p className="font-medium">{account?.profile?.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">{account?.account_number}</p>
                </div>
              </div>

              {/* Amount Info */}
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">{formatNigerianNaira(Number(amount))}</p>
              </div>

              {/* Balance Info */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="font-medium">{formatNigerianNaira(wallet?.balance || 0)}</p>
              </div>
            </div>

            {/* Insufficient Funds Warning */}
            {isInsufficientFunds() && (
              <div className="rounded-xl bg-red-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={18} />
                  <p className="font-medium">Insufficient Balance</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Amount Needed</p>
                  <p className="text-red-600 font-medium">
                    {formatNigerianNaira(Number(amount) - (wallet?.balance || 0))}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-gray-50 to-violet-100 dark:from-gray-800 dark:to-violet-900/40 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-600 hover:to-violet-700 disabled:from-violet-500/50 disabled:to-violet-600/50"
                onClick={handleConfirm}
                disabled={isInsufficientFunds()}
              >
                Proceed
              </Button>
            </div>
          </div>
        </Card>
      </DynamicModal>

      <DynamicModal
        open={proceed}
        setOpen={setProceed}
        dismissible
        dialogClassName={'sm:max-w-fit dark:bg-card !p-0'}
        drawerClassName="dark:bg-card"
        hideDrawerCancel
      >
        <ConfirmPin 
          className='rounded-none' 
          func={handleTransfer}
          profile={account?.profile!}
        />
      </DynamicModal>

      <DynamicModal
        open={success}
        setOpen={setSuccess}
      >
        {confettiShown && <Confetti recycle={false} className='w-full'/>}
        <div className="flex flex-col items-center p-4">
          <div className='w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center text-green-600'>
            <LucideCheckCircle size={20} />
          </div>
          <h2 className="text-xl font-semibold">Transaction Successful!</h2>
          <p className="mt-2 text-xs">
            You have successfully transferred {formatNigerianNaira(Number(amount))} to {account?.profile?.full_name}
          </p>
          <p className='mt-4 text-xs text-muted-foreground'>Secured by isubscribe</p>
        </div>
      </DynamicModal>
    </div>
  )
}

export default TransferComponent
