'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { CheckCircle2, LucideCheck, LucideGift } from 'lucide-react'
import { toast } from 'sonner'
import { updateWalletBalanceByUser } from '@/lib/supabase/wallets'
import { Tables } from '@/types/database'
import DynamicModal from '../DynamicModal'
import { Button } from '../ui/button'
import useWalletStore from '@/store/use-wallet-store'
import CreateUpdateSecurityQuestion from './create-update-security-question'

interface WelcomeBonusModalProps {
    type?: 'basic' | 'premium',
    profile?: Tables<'profile'>,
    wallet?: Tables<'wallet'>,
}

const WelcomeBonusModal = ({ type = 'basic', profile, wallet }: WelcomeBonusModalProps) => {
    const [claimed, setClaimed] = useState(wallet?.bonus_claimed)

    const [openSecurityModal, setOpenSecurityModal] = useState(Boolean(profile?.security_question && profile?.security_answer))
    
    const reward = 50.00

  const [loading, setLoading] = useState(false)
  const [successful, setSuccessful] = useState(false)

  const setWalletBalance = useWalletStore(state => state.setBalance)

  const router = useRouter()

  const handleClaimWelcomeBonus = async () => {

    try {
      setLoading(true)
      if (wallet?.bonus_claimed){
        toast.info("You have claimed your welcome Bonus already!")
        setLoading(false)
        return
      }

      const walletBalance = parseFloat(wallet?.balance?.toString() || '0.00') || 0.00;
      const balance = walletBalance + reward
      console.log(balance, wallet?.id, profile?.id)

      router.refresh()

      const { data } = await updateWalletBalanceByUser(profile?.id!, balance)

      setSuccessful(true)

      setClaimed(true)

      setLoading(false)

      if (data?.balance)
        setWalletBalance(data?.balance)

      router.refresh()
    } catch (error) {
      toast.error("Sorry something went wrong, please try again")
      console.log(error)
    } finally {
        setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setSuccessful(false)
  }

  if (!claimed) {
    return (
        <DynamicModal
            open={(!claimed && !successful)}
            setOpen={setClaimed as any}
            closeModal={() => setClaimed(true)}
            dialogOnly
        >
            <div className='flex flex-col py-2 gap-y-4 items-center justify-center'>
                <div className='h-10 w-10 rounded-full flex items-center justify-center bg-amber-600/20 text-amber-600'>
                    <LucideGift size={15} />
                </div>
                <h2 className='text-base font-semibold text-center'>Congratulations <span className="text-amber-500">{profile?.full_name}</span>!,</h2>
                <p className="text-sm tracking-tighter text-center">Your account has been verified successfully! <br />
                    You&apos;ve also been Awarded with <span className='font-extrabold'>₦{reward}</span> Welcome Bonus for signing up to <span className="font-extrabold">iSubscribe</span>.
                </p>
                <Button 
                    className='w-full rounded-full mt-2' 
                    size={'lg'}
                    onClick={handleClaimWelcomeBonus}
                >
                    {loading ? 'Hang tight...' : 'Claim Bonus Now'}
                </Button>
            </div>
        </DynamicModal>
    )
  }

  else if (successful && claimed) 
    return (
      <DynamicModal
          open={successful && claimed}
          setOpen={setSuccessful}
          dismissible={false}
          dialogOnly
      >
          <div className='flex flex-col py-2 gap-y-4 justify-center items-center'>
              <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600'>
                <LucideCheck size={15} strokeWidth={2}/>
              </div>
              <h2 className='text-base font-semibold text-center'>Welcome to iSubscribe <span className="text-amber-500">{profile?.full_name}</span>,</h2>
              <p className="text-sm tracking-tighter text-center">You have successfully claimed your welcome bonus! We Welcome You to our Community where Bill Payment is just a Click of a Button! What would you like to do from here?
              </p>
              <Button 
                  className='w-full rounded-full mt-2' 
                  variant={'default'}
                  onClick={handleCloseModal}
              >
                  Continue
              </Button>
          </div>
      </DynamicModal>
  )

  else if (!openSecurityModal) {
    return (
        <CreateUpdateSecurityQuestion
          open={openSecurityModal}
          setOpen={setOpenSecurityModal}
        />
    )
  }
    return <></>
}

export default WelcomeBonusModal