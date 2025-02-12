"use client"

import React, { useState } from 'react'
import { set, z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from '@/utils/schema/userSchema'
import InputField from './InputField'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { signUp } from '@/lib/supabase/user.actions'
import Link from 'next/link'
import { Card } from '../ui/card'
import GoogleAuthButton from '../GoogleAuthButton'
import { LucideArrowLeft, LucideLock, LucideMail, LucidePhone, TriangleAlert, UserCircle2 } from 'lucide-react'
import Logo from '../Logo'
import AuthSeparator from './AuthSeparator'
import DynamicModal from '../DynamicModal'
import LoadingOverlay from '../loaders/LoadingOverlay'

const SignInComponent = () => {
    const [isPending, setIsPending] = React.useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlParams = new URLSearchParams(searchParams.toString())
    const [status, setStatus] = useState(urlParams.get('status') === 'email-sent')
    const referral = searchParams.get('referral')

    const [preferEmail, setPreferEmail] = useState(false)

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
          email: "",
          password: "",
          confirm_password: "",
          full_name: "",
          phone: "",
        },
      })
  
      async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        if (values.password !== values.confirm_password) {
            form.setError('confirm_password', { message: 'Passwords do not match' })
            return
        }
        setIsPending(true)
        try {
            const { status, error } = await signUp({
                email: values.email!,
                password: values.password!,
                metadata: {
                    full_name: values.full_name!,
                    phone: values.phone!
                }
            })

            if (error) {
              form.setError('email', { message: error?.message })
              return toast.error(error?.message)
            }

            if (status === 200) {
              toast.success('Success!', { description: 'Verification OTP sent to ' + values.email, duration: 5000 })
              form.reset()
              return router.push(`/auth/verify-otp?email=${encodeURIComponent(values?.email)}&referral=${referral}`)
            }
        }
        catch (error: any) {
            console.error(error)
            setIsPending(false)
            return toast.error('Error!', { description: error?.message })
        }
        finally { setIsPending(false) }
      }

    return (
        <Form {...form}>
          <Card className='flex flex-col gap-2 shadow-none border-none w-full bg-transparent dark:bg-transparent max-w-[450px] py-4 px-3'>

            <Logo />

            {!preferEmail ? <GoogleAuthButton /> : (
              <Button 
                className='rounded-lg w-full h-14 ring-1' 
                variant='outline' 
                onClick={() => setPreferEmail(false)}
              >
                <LucideArrowLeft className='mr-2' />
                Continue with Google
              </Button>
            )}

            {!preferEmail && <AuthSeparator />}

            {!preferEmail && (
              <DynamicModal
                hideDrawerCancel
                trigger={
                  <Button 
                    className='rounded-lg w-full h-14 ring-1' 
                    variant='outline' 
                  >
                    <LucideMail className='mr-2' />
                    Continue with Email
                  </Button>
                }>
                  <div className='flex flex-col gap-2.5 items-center'>
                    <div className='w-12 h-12 rounded-full flex items-center justify-center text-amber-500 bg-amber-600/20'>
                      <TriangleAlert className='w-5 h-5' />
                    </div>
                    <h2 className='text-lg font-semibold text-muted-foreground'>Attention!</h2>
                    <p className='text-sm text-center text-muted-foreground'>We recommend you sign up with the <span className='font-semibold'>continue with google option</span> owing to probable delays in mail carriers in delivering One Time Passwords to certain emails. Our core team remain committed to making email sign ups completely stable soon.</p>

                    <Button 
                      className='rounded-xl w-full h-12' 
                      size="lg"
                      variant='secondary' 
                      onClick={() => setPreferEmail(true)}
                    >
                      <LucideMail className='mr-2' />
                      Continue with Email anyway
                    </Button>
                  </div>
                </DynamicModal>
            )}

            {
              preferEmail && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <InputField name="email" label="Email" placeholder='youremail@example.com' control={form.control} Icon={LucideMail}/>
                  <InputField name="password" label="Password" control={form.control} placeholder='password...' Icon={LucideLock} />
                  <InputField name="confirm_password" label="Confirm Password" control={form.control} placeholder='Confirm password...' Icon={LucideLock} />
                  <InputField name="full_name" label="Full Name" placeholder='Your Name' control={form.control} Icon={UserCircle2}/>
                  <InputField name="phone" label="Phone Number" placeholder='09012345678' control={form.control} Icon={LucidePhone}/>

                  <Button type="submit" disabled={isPending} className='mt-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 h-12' size={'lg'}>{isPending ? 'Processing...' : 'Create Account'}</Button>
                </form>
              )
            }
            
            <div className="flex flex-col space-y-2 text-base">
              <p className='text-foreground'>Already have an account? <Link href="/sign-in" className="underline dark:text-violet-400 text-primary">Log In</Link></p>
            </div>

            <DynamicModal 
              open={status}
              setOpen={setStatus}
              dialogOnly
            >
              <div className='flex flex-col gap-y-4 py-2'>
                <h1 className='text-xl font-semibold text-primary dark:text-primary/90'>Email Sent!</h1>
                <p className='text-sm'>A verification email has been sent to your email address. Please verify your email to continue.</p>
                <div className='flex flex-row gap-x-2 float-right justify-end md:-mb-4'>
                  <Button 
                    variant={'secondary'}
                    className='bg-red-500 ring-2 ring-red-600/90 rounded-lg text-white hover:bg-red-400 focus:ring-0 focus-within:ring-0' 
                    onClick={() => {
                      urlParams.set('status', 'closed')
                      router.replace('?' + urlParams.toString())
                    }}
                  >Close</Button>
                </div>
              </div>
            </DynamicModal>

          </Card>

          {
            isPending && <LoadingOverlay loader='2' isPending={isPending} />
          }
        </Form>
      )
}

export default SignInComponent