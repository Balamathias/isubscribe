import Bottombar from '@/components/dashboard/navigation/Bottombar'
import Sidebar from '@/components/dashboard/navigation/Sidebar'
import Topbar from '@/components/dashboard/navigation/Topbar'
import { getUser } from '@/lib/supabase/accounts'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

export const metadata:Metadata = {
    title: 'isubscribe | Dashboard.',
    description: 'Your home of affordable utility bills.',
    openGraph: {
      images: ['/opengraph/og-2.jpeg', '/opengraph/og-3.jpeg',  '/opengraph/og-4.jpeg'],
    }
}

const Layout = async ({ children }: PropsWithChildren) => {

  const { data: user } = await getUser()

  if (user && (!user?.onboarded || !user?.pin || user?.pin === '')) {
    return redirect('/auth/pass-pin')
  }

  return (
    <div className='md:bg-violet-100/90 bg-violet-50 dark:bg-gray-900 flex min-h-screen w-full overflow-hidden relative'>
       <Sidebar profile={user!} />
          <div className="flex flex-col w-full relative overflow-auto custom-scrollbar ml-2 md:ml-[180px]">
              <Topbar profile={user} />
              { children }
          </div>
        <Bottombar />
    </div>
  )
}

export default Layout
