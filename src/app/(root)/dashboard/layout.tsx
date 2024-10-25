import Bottombar from '@/components/dashboard/navigation/Bottombar'
import Sidebar from '@/components/dashboard/navigation/Sidebar'
import Topbar from '@/components/dashboard/navigation/Topbar'
import { getUser } from '@/lib/supabase/accounts'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

export const metadata:Metadata = {
    title: 'isubscribe | Dashboard.',
    description: 'Your home of affordable utility bills.',
}

const Layout = async ({ children }: PropsWithChildren) => {

  const [
    { data: profile }, 
    { data }
  ] = await Promise.all([
    getUser(),
    getCurrentUser()
  ])

  if (!data?.user) return redirect('/sign-in')

  return (
    <div className='bg-violet-50/90 dark:bg-gray-900 flex min-h-screen w-full overflow-hidden relative'>
       <Sidebar />
          <div className="flex flex-col w-full relative overflow-auto custom-scrollbar ml-2 md:ml-[180px]">
              <Topbar profile={profile!} />
              { children }
          </div>
        <Bottombar />
    </div>
  )
}

export default Layout
