import WidthWrapper from '@/components/WidthWrapper'
import ResetPasswordComponent from '@/components/auth/ResetPasswordComponent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const ResetPasswordPage = ({searchParams}: { searchParams: {[key: string]: string}}) => {
    const urlParams = new URLSearchParams(searchParams)
    const email = urlParams.get('email')
  return (
    <WidthWrapper className="min-h-screen justify-center items-center">
        <ResetPasswordComponent email={email!} />
    </WidthWrapper>
  )
}

export default ResetPasswordPage