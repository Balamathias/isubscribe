import { Card } from '@/components/ui/card'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col p-4 gap-y-5 mx-auto w-full py-8 min-h-screen max-w-7xl'>
      <h2 className="text-2xl md:text-3xl font-semibold">iSubscribe Privacy Policy</h2>

      <Card className='py-6 px-4 md:px-5 flex flex-col border-none gap-y-4 rounded-lg shadow-none !bg-purple-500/20 text-purple-500'>
        <h2 className='text-base font-semibold md:text-xl'>How we use your data?</h2>
        <p className='text-sm md:text-base'>We may use your `email` and `username` to auto-create your iSubscribe virtual account when you sign up for the first time, or to verify your identity as the case may be.</p>
        <p className='text-sm md:text-base'>iSubscribe cannot read your PIN or Password as the Passwords and Pins are hashed using the bcrypt package. This is to ensure that a layer of security is added.</p>
        <p className='text-sm md:text-base'>We might use your email to update your with news of our recent updates.</p>
      </Card>
    </div>
  )
}

export default Page