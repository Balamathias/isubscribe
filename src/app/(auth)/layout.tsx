import AuthTestimonial from '@/components/auth/AuthTestimonials'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {

  return (
    <main className="bg-[url('/images/slides/first-slide.jpg')] bg-cover bg-no-repeat inset-0 min-h-screen w-full flex flex-col flex-1">
        <div className='flex md:justify-between justify-between flex-col-reverse md:flex-row bg-background/80 inset-0'>
          <div className="flex-1 md:px-4 py-6 bg-background/80 md:bg-background">
            {children}
          </div>
          <div className="flex-1 md:flex hidden bg-secondary/90 dark:bg-secondary/80">
            <AuthTestimonial />
          </div>
        </div>
    </main>
  )
}

export default RootLayout