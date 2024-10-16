import React, { useState } from 'react'
import DynamicModal from '../DynamicModal'
import { LucideLock } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSetSecurityQ } from '@/lib/react-query/funcs/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { resetTransactionPin } from '@/lib/supabase/user.actions'

interface CreateUpdateSecurityQuestionProps {
    open: boolean,
    setOpen: (bool: boolean) => void,
    data?: {
        security_question?: string,
        security_answer?: string
    },
    update?: boolean
}

const CreateUpdateSecurityQuestion = ({
    open: openSecurityModal,
    data,
    setOpen: setOpenSecurityModal,
    update=false
}: CreateUpdateSecurityQuestionProps) => {

    const router = useRouter()

    const [toggleSetQuestion, setToggleSetQuestion] = useState(false)

    const { mutate: setQ, isPending } = useSetSecurityQ()

    const [values, setValues] = useState({
      q: data?.security_question || '',
      a: data?.security_answer || ''
    })

    const handleSecurityQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        
        setQ({
          security_question: values.q,
          security_answer: values.a
        }, {
          onSuccess: () => {
            setOpenSecurityModal(true)
            toast.success(`Security question ${ update ? 'updated': 'set' } successfully.`)
            router.refresh()
          },
          onError: err => toast.error(err.message)
        })
      }

  return (
    <DynamicModal
        open={(!openSecurityModal)}
        setOpen={setOpenSecurityModal}
        dialogOnly
        closeModal={() => setOpenSecurityModal(true)}
        dismissible
    >
        <div className='flex flex-col py-2 gap-y-4 items-center justify-center text-center'>
            <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600/20 text-green-600'>
                <LucideLock size={15} />
            </div>
            {
                (toggleSetQuestion || update) ? (
                    <form className='flex flex-col w-full flex-1 gap-y-3' onSubmit={handleSecurityQuestion}>
                        <div className='flex flex-col gap-y-2'>
                        <Label htmlFor={'security-q'}>Question</Label>
                        <Input 
                            id='security-q' 
                            placeholder='(E.g): What is my best color? ' 
                            defaultValue={values.q}
                            className='w-full border-none rounded-lg bg-secondary' 
                            required 
                            min={2} 
                            onChange={
                            (e) => setValues({
                                ...values,
                                q: e.target.value
                            })
                            }
                        />
                        </div>

                        <div className='flex flex-col gap-y-2'>
                        <Label htmlFor={'security-a'}>Answer</Label>
                        <Input 
                            id='security-a' 
                            placeholder='(E.g): red ' 
                            className='w-full border-none rounded-lg bg-secondary'
                            required
                            min={2}
                            defaultValue={values.a}
                            type='text'
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
                        variant={'default'}
                        >
                        {isPending ? 'Processing...' : 'Continue'}
                        </Button>

                    </form>
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
                        <Button 
                            className='w-full rounded-full mt-2 border-none hidden' 
                            size={'lg'}
                            variant={'secondary'}
                            onClick={() => {
                                localStorage.setItem('isubscribe.security.consent', 'false')
                            }}
                        >
                            I don&apos;t want to see this
                        </Button>
                    </>
                )
            }
        </div>
</DynamicModal>
  )
}

export default CreateUpdateSecurityQuestion