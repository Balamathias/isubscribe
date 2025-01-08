'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { updateAuthUser } from "@/lib/supabase/user.actions"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import CustomInput from "../CustomInput"
import { LucideLock } from "lucide-react"

export default function ResetPasswordComponent({ email }: { email: string }) {
  const [isPending, setIsPending] = useState(false)
  const [fields, setFields] = useState({
    password: '',
    password2: '',
  })

  const router = useRouter()

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fields.password !== fields.password2) return toast.error('Passwords do not match!')
    try {
      setIsPending(true)

      const { data, error } = await updateAuthUser(fields.password)

      if (error) return toast.error(error?.message)

      if (data) {
        toast.success('Password reset successful', {description: 'You have successfully reset your password.'})
        return router.replace('/auth/password-reset-success')
      }

    } catch (error: any) {
      console.error(error)
      setIsPending(false)
      toast.error(error?.message, {
        description: "Sorry, we could not reset your password by this time.",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-sm:w-full max-md:flex-1">
      <Card className="w-full md:w-[500px] border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl py-1 font-normal">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter a new password for your account: <b>{email}</b>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <CustomInput 
                id="password" 
                type="password" 
                onChange={(e) => setFields({ ...fields, password: e.target.value }) }
                required 
                placeholder="Password..."
                Icon={LucideLock}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password2">Confirm Password</Label>
            <CustomInput 
                id="password2" 
                type="password" 
                onChange={(e) => setFields({ ...fields, password2: e.target.value }) }
                required 
                placeholder="Confirm password"
                Icon={LucideLock}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full rounded-lg bg-gradient-to-tr from-violet-600 to-pink-600 data-[disabled:true]:opacity-70" size={'lg'} disabled={isPending}>{isPending ? 'Processing...' : 'Reset'}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
