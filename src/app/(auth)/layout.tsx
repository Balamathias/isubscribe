import { getCurrentUser } from '@/lib/supabase/user.actions'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { data: { user } } = await getCurrentUser()
  if (user) return redirect('/dashboard')
  return (
    <main className="flex md:justify-between justify-between flex-col-reverse md:flex-row gap-4 bg-violet-50/80 dark:bg-baxkground">
        <div className="flex-1 px-4 py-6 bg-white dark:bg-background">
          {children}
        </div>
        <div className="flex-1 md:flex hidden">
          <Image
            src='/auth/auth.svg'
            alt={'Sign In | Up'}
            quality={100}
            width={500}
            height={500}
            className='w-full h-96 md:h-full object-contain'
          />
        </div>
    </main>
  )
}

export default RootLayout