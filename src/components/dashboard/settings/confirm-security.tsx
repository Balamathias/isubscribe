import DynamicModal from '@/components/DynamicModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { getUser } from '@/lib/supabase/accounts'
import { sendResetPinOTP, verifyResetPinOtp } from '@/lib/supabase/user.actions'
import { LucideCheck, LucideLock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ResetPinOTPInput from './reset-pin-otp-input'
import { verifyOtp } from '@/lib/supabase/verify-otp'

interface ConfirmSecurityProps {
    trigger?: React.ReactNode,
    setShowResetPin?: (bool: boolean) => void,
    func?: () => void
}
const ConfirmSecurity = ({ trigger, setShowResetPin, func }: ConfirmSecurityProps) => {

  const [toggleConfirmForm, setToggleConfirmForm] = useState(false)
  const [tokenSent, setTokenSent] = useState(false)

  const { data: profile } = useGetProfile()

  const [tokenValue, setTokenValue] = useState('')

  const [status, setStatus] = useState<'stale' | 'pending' | 'settled'>('stale')
  const [tokenStatus, setTokenStatus] = useState<'stale' | 'pending' | 'settled'>('stale')
  const [tokenConfirmStatus, setTokenConfirmStatus] = useState<'stale' | 'pending' | 'settled'>('stale')

  const [value, setValue] = useState('')

  const hasSecurityQuestionSet = Boolean(profile?.data?.security_question && profile?.data?.security_answer)

  useEffect(() => {
    (async () => {
        if (tokenValue?.length === 5) {
            await handleVerifyToken()
        }
    })()
  }, [tokenValue])

  const handleSecurityQuestion = async (e: React.FormEvent) => {

    e.preventDefault()
    
    try {
        setStatus('pending')
        const { data: profile } = await getUser()
        setStatus('settled')

        if (value.trim().toLowerCase() === profile?.security_answer?.toLowerCase()) {
            setShowResetPin?.(true)
            func?.()
            toast.success('Security answer verified')
        } else {
            toast.error('Wrong security answer, please try again or contact support.')
        }

    } catch (error) {
        setStatus('settled')
        console.error(error)
    } finally {
        setStatus('settled')
    }
  }

  const handleTokenResetPin = async () => {
    setTokenStatus('pending')

    try {
        const response = await sendResetPinOTP()

        if (response?.error) {
            toast.error(response?.error?.message)
            setTokenStatus('settled')
            return
        }

        toast.success('A reset pin token has been sent to ' + profile?.data?.email + ' successfully.')
        setTokenSent(true)
        setTokenStatus('settled')

    } catch (error: any) {
        console.error(error)
        toast.error(error?.message)
        setTokenStatus('settled')
    } finally {
        setTokenStatus('settled')
    }
  }

  const handleVerifyToken = async () => {
    setTokenConfirmStatus('pending')

    try {
        const response = await verifyResetPinOtp(tokenValue)

        if (!response) {
            toast.error('Invalid or expired OTP')
            setTokenConfirmStatus('settled')
            return
        }

        setShowResetPin?.(true)
        func?.()
        setTokenValue('')

        toast.success('Confirmation successful!')
        setTokenConfirmStatus('settled')

    } catch (error: any) {
        console.error(error)
        toast.error(error?.message)
        setTokenValue('')
        setTokenConfirmStatus('settled')
    } finally {
        setTokenConfirmStatus('settled')
    }
  }

  return (
    <div>
        <DynamicModal
            trigger={trigger}
        >
            <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600 mx-auto'>
                {
                    tokenSent ? (
                        <LucideCheck />
                    ): (
                        <LucideLock size={15} />
                    )
                }
            </div>
            {
                toggleConfirmForm ? (
                    <form className='flex flex-col w-full flex-1 gap-y-3 items-center justify-center text-center' onSubmit={handleSecurityQuestion}>
                        <div className='flex flex-col gap-y-2'>
                            <h2 className='font-semibold text-base'>{profile?.data?.security_question}</h2>
                        </div>

                        <div className='flex flex-col gap-y-2'>
                        <Label htmlFor={'security-a'} className='sr-only'>Answer</Label>
                        <Input 
                            id='security-a' 
                            placeholder='Your answer... ' 
                            className='w-full border-none rounded-lg bg-secondary'
                            required
                            min={2}
                            defaultValue={value}
                            onChange={e => setValue(e.target.value)}
                            type='text'
                        />
                        </div>

                        <Button 
                        className='w-full rounded-full mt-2 border-none' 
                        size={'lg'}
                        variant={'default'}
                        >
                            { status === 'pending' ? 'Confirming...' : 'Confirm'}
                        </Button>
                    </form>
                ) : (

                    <div className='flex flex-col gap-y-3 items-center justify-center'>
                        {
                            hasSecurityQuestionSet ? (
                                <div>
                                {
                                tokenSent ? (
                                    <>
                                        <h2 className='text-lg font-semibold text-center'>Token sent</h2>

                                        <p className="text-sm tracking-tighter text-center">Please verify the 5-digit token sent to your email. Didn&apos;t find it? Check your spam folder or request for a new one.
                                        </p>

                                        <div className='flex flex-col w-full justify-center items-center'>
                                            <ResetPinOTPInput 
                                                onChange={(value) => setTokenValue(value)}
                                            />
                                        </div>

                                        <Button 
                                            className='w-full rounded-full mt-2 border-none' 
                                            size={'lg'}
                                            onClick={handleVerifyToken}
                                            disabled={tokenConfirmStatus === 'pending'}
                                        >
                                            {tokenConfirmStatus === 'pending' ? 'Verifying...' : 'Verify'}
                                        </Button>

                                        <Button 
                                            className='w-full rounded-full mt-2 border-none' 
                                            size={'lg'}
                                            onClick={handleTokenResetPin}
                                            variant={'secondary'}
                                            disabled={tokenStatus === 'pending'}
                                            >
                                                {tokenStatus === 'pending' ? 'Sending...' : 'Resend Token'}
                                        </Button>
                                    </>
                                        ) :
                                    (<>
                                        <h2 className='text-lg font-semibold text-center'>Verify Security Question or Request a verification token</h2>
                                        <p className="text-sm tracking-tighter text-center">To reset your pin this way, you must verify the security question you set when your first signed up to iSubscribe or request a verification token for your email. 
                                        </p>
                                        <Button 
                                            className='w-full rounded-full mt-2 border-none' 
                                            size={'lg'}
                                            onClick={() => setToggleConfirmForm(true)}
                                        >
                                            Verify Question!
                                        </Button>

                                        <Button 
                                            className='w-full rounded-full mt-2 border-none' 
                                            size={'lg'}
                                            onClick={handleTokenResetPin}
                                            variant={'secondary'}
                                            disabled={tokenStatus === 'pending'}
                                            >
                                                {tokenStatus === 'pending' ? 'Sending...' : 'Request Token'}
                                        </Button>
                                    </>)
                                }
                                </div>
                            ): (
                                <div>
                                    {
                                        tokenSent ? (
                                            <>
                                                <h2 className='text-lg font-semibold text-center'>Token sent</h2>

                                                <p className="text-sm tracking-tighter text-center">Please verify the 5-digit token sent to your email. Didn&apos;t find it? Check your spam folder or request for a new one.
                                                </p>

                                                <div className='flex flex-col w-full justify-center items-center'>
                                                    <ResetPinOTPInput 
                                                        onChange={(value) => setTokenValue(value)}
                                                    />
                                                </div>

                                                <Button 
                                                    className='w-full rounded-full mt-2 border-none' 
                                                    size={'lg'}
                                                    onClick={handleVerifyToken}
                                                    disabled={tokenConfirmStatus === 'pending'}
                                                >
                                                    {tokenConfirmStatus === 'pending' ? 'Verifying...' : 'Verify'}
                                                </Button>

                                                <Button 
                                                    className='w-full rounded-full mt-2 border-none' 
                                                    size={'lg'}
                                                    onClick={handleTokenResetPin}
                                                    variant={'secondary'}
                                                    disabled={tokenStatus === 'pending'}
                                                    >
                                                        {tokenStatus === 'pending' ? 'Sending...' : 'Resend Token'}
                                                </Button>
                                            </>
                                        ): (
                                            <>
                                                <h2 className='text-lg font-semibold text-center'>Send verification token</h2>

                                                <p className="text-sm tracking-tighter text-center">We will send a verification one-time password to your registered email so as to verify your request to reset your PIN. Once you are ready, click on &quot;Request Token&quot; below.
                                                </p>

                                                <Button 
                                                    className='w-full rounded-full mt-2 border-none' 
                                                    size={'lg'}
                                                    onClick={handleTokenResetPin}
                                                    disabled={tokenStatus === 'pending'}
                                                >
                                                    {tokenStatus === 'pending' ? 'Sending...' : 'Request Token'}
                                                </Button>
                                            </>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                )
            }
        </DynamicModal>
    </div>
  )
}

export default ConfirmSecurity