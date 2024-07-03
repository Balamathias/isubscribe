"use client"

import React from 'react'
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthSchema } from '@/utils/schema/userSchema'
import InputField from './InputField'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/supabase/user.actions'
import Link from 'next/link'
import { Card } from '../ui/card'
import GoogleAuthButton from '@/components/GoogleAuthButton'
import { LucideLock, LucideMail } from 'lucide-react'
import Logo from '../Logo'
import AuthSeparator from './AuthSeparator'
import DynamicModal from '../DynamicModal'
import LoadingOverlay from '../loaders/LoadingOverlay'

const SignInComponent = () => {
    const [isPending, setIsPending] = React.useState(false)
    const router = useRouter()
    const [status, setStatus] = React.useState(false)
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')

    const form = useForm<z.infer<typeof AuthSchema>>({
        resolver: zodResolver(AuthSchema),
        defaultValues: {
          email: "",
          password: ""
        },
      })
  
      async function onSubmit(values: z.infer<typeof AuthSchema>) {
        setIsPending(true)
        try {
            const {status, message} = await signIn({
                email: values.email!,
                password: values.password!
            })
            if (status === 200)
              setStatus(true)
              setSuccess('You have successfully signed in to your account, you will be redirected to the dashboard shortly.')
              toast.success(message)
            router.push('/')
            return
        }
        catch (error: any) {
            console.error(error)
            setIsPending(false)
            setStatus(true)
            setError(error.message === 'fetch failed' ? 'Make sure you are connected to the internet to continue.' : 'Make sure the details yyou entered are correct. You may want to double-check your Password or Email.')
        }
        finally { setIsPending(false) }
      }

    return (
        <Form {...form}>
          <Card className='flex flex-col gap-2 shadow-none border-none w-full max-w-[450px] p-3 py-4'>

            <Logo />

            <GoogleAuthButton />

            <AuthSeparator />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-1 flex-col">

              <div>
                <InputField 
                  name="email" 
                  label="Email" 
                  placeholder='youremail@example.com' 
                  control={form.control} 
                  Icon={LucideMail}
                />
              </div>

              <InputField 
                name="password" 
                label="Password" 
                control={form.control} 
                placeholder='password...' 
                Icon={LucideLock} 
              />

              <Button type="submit" disabled={isPending} className='rounded-lg w-full mt-2' size={'lg'}>{isPending ? 'Processing...' : 'Sign In'}</Button>
            </form>
            <div className="flex flex-col space-y-2 text-xs md:text-base py-2">
              <p className='text-foreground'>{"Don't"} have an account? <Link href="/sign-up" className="underline text-primary">Sign up</Link></p>
              <p className='text-foreground'>Forgot password? <Link href="/auth/forgot-password" className="underline text-primary">Reset password</Link></p>
            </div>
          </Card>

          <DynamicModal 
              open={status}
              setOpen={setStatus}
              dialogOnly
            >
              <div className='flex flex-col gap-y-4 py-2'>
                <h1 className='text-xl font-semibold text-primary dark:text-primary/90'>{success ? 'Success!': 'Sign In failed.'}</h1>
                <p className='text-sm'>{success ? success : error }</p>
                <div className='flex flex-row gap-x-2 float-right justify-end md:-mb-4'>
                  <Button 
                    variant={'secondary'}
                    className='bg-red-500 ring-2 ring-red-600/90 rounded-lg text-white hover:bg-red-400 focus:ring-0 focus-within:ring-0' 
                    onClick={() => setStatus(false)}
                  >Close</Button>
                </div>
              </div>
            </DynamicModal>

            {
              isPending && <LoadingOverlay loader='2' isPending={isPending} />
            }
        </Form>
      )
}

export default SignInComponent