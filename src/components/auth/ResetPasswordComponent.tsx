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

      const { data } = await updateAuthUser(fields.password)
      if (data) {
        toast.success('Password reset successful', {description: 'You have successfully reset your password.'})
        return router.replace('/auth/password-reset-success')
      }

    } catch (error) {
      console.error(error)
      setIsPending(false)
      toast.error("An error occured.", {
        description: "Sorry, we could not reset your password by this time.",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-sm border-none shadow-lg drop-shadow-lg w-full min-w-max md:w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl py-1 text-primary">Reset Password</CardTitle>
          <CardDescription>
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
          <Button className="w-full rounded-lg" size={'lg'} disabled={isPending}>{isPending ? 'Processing...' : 'Reset'}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
