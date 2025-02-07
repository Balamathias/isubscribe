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
import LoadingOverlay from '../loaders/LoadingOverlay'

const SignInComponent = () => {
    const [isPending, setIsPending] = React.useState(false)
    const router = useRouter()

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
            const {status, message, error} = await signIn({
                email: values.email!,
                password: values.password!
            })
            if (status === 200) {
              toast.success(message)
              return router.push('/dashboard')
            }
            
            if (error) {
             return toast.error(error?.message)
            }
        }
        catch (error: any) {
            console.error(error)
            setIsPending(false)
            toast.error(error.message === 'fetch failed' ? 'Make sure you are connected to the internet to continue.' : 'Make sure the details you entered are correct. You may want to double-check your Password or Email.')
        }
        finally { setIsPending(false) }
      }

    return (
        <Form {...form}>
          <Card className='flex flex-col gap-2 shadow-none border-none w-full max-w-[450px] p-3 py-4 bg-transparent dark:bg-transparent'>

            <Logo />

            <h2 className='text-3xl font-semibold py-2 text-primary hidden'>Login</h2>

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

              <Button type="submit" disabled={isPending} className='rounded-lg w-full mt-2 bg-gradient-to-r from-violet-600 to-pink-600 h-14' size={'lg'}>{isPending ? 'Processing...' : 'Log In'}</Button>
            </form>
            <div className="flex flex-col space-y-2 text-base py-2">
              <p className='text-foreground'>{"Don't"} have an account? <Link href="/sign-up" className="underline dark:text-violet-400">Create account</Link>.</p>
              <p className='text-foreground'>Forgot password? <Link href="/auth/forgot-password" className="underline text-primary dark:text-violet-400">Reset password</Link></p>

            </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-4">
              By signing in, you agree to our{' '}
              <Link href="/terms-and-conditions" className="underline text-primary dark:text-violet-400 hover:text-primary/80">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="underline text-primary dark:text-violet-400 hover:text-primary/80">
                Privacy Policy
              </Link>
              </div>
          </Card>
            {
              isPending && <LoadingOverlay loader='2' isPending={isPending} />
            }
        </Form>
      )
}

export default SignInComponent