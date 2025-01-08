import WidthWrapper from '@/components/WidthWrapper'
import ResetPasswordComponent from '@/components/auth/ResetPasswordComponent'
import { getUser } from '@/lib/supabase/accounts'
import React from 'react'

const ResetPasswordPage = async ({searchParams}: { searchParams: {[key: string]: string}}) => {

    const user = await getUser()

  return (
    <WidthWrapper className="min-h-screen flex-1 justify-center items-center px-2 md:px-6 bg-background/80 w-full">
        <ResetPasswordComponent email={user?.data?.email!} />
    </WidthWrapper>
  )
}

export default ResetPasswordPage