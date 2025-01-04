import WidthWrapper from '@/components/WidthWrapper'
import ResetPasswordComponent from '@/components/auth/ResetPasswordComponent'
import React from 'react'

const ResetPasswordPage = ({searchParams}: { searchParams: {[key: string]: string}}) => {
    const urlParams = new URLSearchParams(searchParams)
    const email = urlParams.get('email')
  return (
    <WidthWrapper className="min-h-screen flex-1 justify-center items-center px-2 md:px-6 bg-background/80 w-full">
        <ResetPasswordComponent email={email!} />
    </WidthWrapper>
  )
}

export default ResetPasswordPage