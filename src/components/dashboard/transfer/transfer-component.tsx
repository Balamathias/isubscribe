'use client'

import React, { useCallback, useState } from 'react'
import { StyledInput } from "@/components/ui/styled-input"
import { User2, Wallet } from "lucide-react"
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
    setShowConfirmation(false)
    setProceed(true)
  }

  const handleTransfer = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Implement transfer logic
      toast.success('Transfer initiated')
    } catch (err) {
      toast.error('Transfer failed')
    } finally {
      setIsSubmitting(false)
    }
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
        <Card className="p-4 space-y-2 bg-secondary/50">
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
        />
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={!account || !amount || isSubmitting}
        className="w-full h-12 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Transfer Funds'}
      </Button>

      <DynamicModal
        open={showConfirmation}
        setOpen={setShowConfirmation}
        dialogClassName='w-full'
      >
        <div className="p-6 space-y-6 w-full">
          <h2 className="text-xl font-semibold">Confirm Transfer</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Recipient</p>
              <p className="font-medium">{account?.profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">{account?.account_number}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{formatNigerianNaira(Number(amount))}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="font-medium">{formatNigerianNaira(wallet?.balance || 0)}</p>
            </div>
            {isInsufficientFunds() && (
              <div className="p-4 bg-destructive/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-destructive">
                  <p className="font-medium">Insufficient Funds</p>
                  <p className="font-medium">
                    Deficit: {formatNigerianNaira(Number(amount) - (wallet?.balance || 0))}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your current balance is not enough to complete this transfer.
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isInsufficientFunds()}
            >
              Confirm
            </Button>
          </div>
        </div>
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
    </div>
  )
}

export default TransferComponent
