import DynamicModal from '@/components/DynamicModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { getUser } from '@/lib/supabase/accounts'
import { LucideLock } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface ConfirmSecurityProps {
    trigger?: React.ReactNode,
    setShowResetPin?: (bool: boolean) => void,
    func?: () => void
}
const ConfirmSecurity = ({ trigger, setShowResetPin, func }: ConfirmSecurityProps) => {

  const [toggleConfirmForm, setToggleConfirmForm] = useState(false)
  const { data: profile } = useGetProfile()

  const [status, setStatus] = useState<'stale' | 'pending' | 'settled'>('stale')

  const [value, setValue] = useState('')

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
    }
  }

  return (
    <div>
        <DynamicModal
            trigger={trigger}
            dialogOnly
        >
            <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600 mx-auto'>
                <LucideLock size={15} />
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
                        <h2 className='text-lg font-semibold text-center'>Verify Security Question</h2>
                        <p className="text-sm tracking-tighter text-center">To reset your pin this way, you must verify the security question you set when your first signed up to iSubscribe. 
                        </p>
                        <Button 
                            className='w-full rounded-full mt-2 border-none' 
                            size={'lg'}
                            onClick={() => setToggleConfirmForm(true)}
                        >
                            Verify Now!
                        </Button>
                    </div>
                )
            }
        </DynamicModal>
    </div>
  )
}

export default ConfirmSecurity