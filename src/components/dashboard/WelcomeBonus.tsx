'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { CheckCircle2, LucideLock } from 'lucide-react'
import { toast } from 'sonner'
import { updateWalletBalanceByUser } from '@/lib/supabase/wallets'
import { Tables } from '@/types/database'
import DynamicModal from '../DynamicModal'
import { Button } from '../ui/button'
import useWalletStore from '@/store/use-wallet-store'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useSetSecurityQ } from '@/lib/react-query/funcs/user'

interface WelcomeBonusModalProps {
    type?: 'basic' | 'premium',
    profile?: Tables<'profile'>,
    wallet?: Tables<'wallet'>,
}

const WelcomeBonusModal = ({ type = 'basic', profile, wallet }: WelcomeBonusModalProps) => {
    const [claimed, setClaimed] = useState(wallet?.bonus_claimed)

    const [openSecurityModal, setOpenSecurityModal] = useState(Boolean(profile?.security_question))
    const [toggleSetQuestion, setToggleSetQuestion] = useState(false)

    const { mutate: setQ, isPending } = useSetSecurityQ()

    const [values, setValues] = useState({
      q: '',
      a: ''
    })
    
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

  const handleSecurityQuestion = () => {
    setQ({
      security_question: values.q,
      security_answer: values.a
    }, {
      onSuccess: () => {
        setOpenSecurityModal(false)
        toast.success('Security question set successfully.')
        router.refresh()
      },
      onError: rr => toast.error(rr.message)
    })
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
            <div className='flex flex-col py-2 gap-y-4'>
                <h2 className='text-xl font-semibold text-center'>Congratulations <span className="text-amber-500">{profile?.full_name}</span>!,</h2>
                <p className="text-base tracking-tighter text-center">Your account has been verified successfully! <br />
                    You&apos;ve also been Awarded with <span className='font-extrabold'>₦200</span> Welcome Bonus for signing up to <span className="font-extrabold">iSubscribe</span>.
                </p>
                <Button 
                    className='w-full rounded-xl mt-2' 
                    size={'lg'}
                    onClick={handleClaimWelcomeBonus}
                >
                    {loading ? 'Hang tight...' : 'Claim Bonus Now 🎉'}
                </Button>
            </div>
        </DynamicModal>
    )
  }

  else if (!openSecurityModal) {
    return (
        <DynamicModal
              open={(!openSecurityModal)}
              setOpen={setOpenSecurityModal as any}
              dialogOnly
            >
                <div className='flex flex-col py-2 gap-y-4 items-center justify-center text-center'>
                    <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600'>
                        <LucideLock size={15} />
                    </div>
                    {
                        toggleSetQuestion ? (
                            <div className='flex flex-col w-full flex-1 gap-y-3'>
                              <div className='flex flex-col gap-y-2'>
                                <Label htmlFor={'security-q'}>Question</Label>
                                <Input id='security-q' placeholder='(E.g): What is my best color? ' 
                                className='w-full border-none rounded-lg bg-secondary' required min={1} 
                                  onChange={
                                    (e) => setValues({
                                      ...values,
                                      q: e.target.value
                                    })
                                  }
                                />
                              </div>

                              <div className='flex flex-col gap-y-2'>
                                <Label htmlFor={'security-q'}>Answer</Label>
                                <Input id='security-q' placeholder='(E.g): red ' 
                                  className='w-full border-none rounded-lg bg-secondary'
                                  required
                                  min={1}
                                  onChange={
                                    (e) => setValues({
                                      ...values,
                                      a: e.target.value
                                    })
                                  }
                                />
                              </div>

                              <Button 
                                className='w-full rounded-full mt-2 border-none' 
                                size={'lg'}
                                onClick={handleSecurityQuestion}
                                variant={'default'}
                              >
                                {isPending ? 'Processing...' : 'Continue'}
                              </Button>
                            </div>
                        ): (
                            <>
                              <h2 className='text-lg font-semibold text-center'>Set Your Security Question</h2>
                              <p className="text-sm tracking-tighter text-center">Setting a security question would help you to quickly recover or reset your PIN should you forget it.
                              </p>
                              <Button 
                                className='w-full rounded-full mt-2 border-none' 
                                size={'lg'}
                                onClick={() => setToggleSetQuestion(true)}
                              >
                                Set Question
                              </Button>
                            </>
                        )
                    }
                </div>
        </DynamicModal>
    )
  }

    return (
        <DynamicModal
            open={!successful && claimed}
            setOpen={setSuccessful}
            dismissible={false}
        >
            <div className='flex flex-col py-2 gap-y-4'>
                <div className='w-full mx-auto flex py-1 items-center justify-center'>
                    <CheckCircle2 strokeWidth={2} size={60} className='text-green-600' />
                </div>
                <h2 className='text-xl font-semibold text-center'>Congratulations <span className="text-amber-500">{profile?.full_name} 🎉</span>!</h2>
                <p className="text-base tracking-tighter text-center">You have successfully claimed your welcome bonus! We Welcome You to our Community where Bill Payment is just a Click of a Button! What would you like to do from here?
                </p>
                <Button 
                    className='w-full rounded-full mt-2' 
                    variant={'secondary'}
                    onClick={handleCloseModal}
                >
                    Continue
                </Button>
            </div>
        </DynamicModal>
    )
}

export default WelcomeBonusModal