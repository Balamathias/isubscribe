import DynamicModal from '@/components/DynamicModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LucideLock } from 'lucide-react'
import React, { useState } from 'react'

interface ConfirmSecurityProps {
    trigger?: React.ReactNode
}
const ConfirmSecurity = ({ trigger }: ConfirmSecurityProps) => {

  const [toggleConfirmForm, setToggleConfirmForm] = useState(false)

  const handleSecurityQuestion = async (e: React.FormEvent) => {

  }

  return (
    <div>
        <DynamicModal
            trigger={trigger}
            dialogOnly
        >
            <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600'>
                <LucideLock size={15} />
            </div>
            {
                toggleConfirmForm ? (
                    <form className='flex flex-col w-full flex-1 gap-y-3' onSubmit={handleSecurityQuestion}>
                        <div className='flex flex-col gap-y-2'>
                        </div>

                        <div className='flex flex-col gap-y-2'>
                        <Label htmlFor={'security-a'}>Answer</Label>
                        <Input 
                            id='security-a' 
                            placeholder='(E.g): red ' 
                            className='w-full border-none rounded-lg bg-secondary'
                            required
                            min={2}
                            // defaultValue={values.a}
                            type='text'
                            // onChange={
                            // (e) => setValues({
                            //     ...values,
                            //     a: e.target.value
                            // })
                            // }
                        />
                        </div>

                        <Button 
                        className='w-full rounded-full mt-2 border-none' 
                        size={'lg'}
                        variant={'default'}
                        >
                        {/* {isPending ? 'Processing...' : 'Continue'} */}
                        </Button>
                    </form>
                ) : (

                    <div className='flex flex-col gap-y-3 items-center justify-center'>
                        <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600'>
                            <LucideLock size={15} />
                        </div>
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