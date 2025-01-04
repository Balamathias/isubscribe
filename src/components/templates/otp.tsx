import React from 'react'

const OTPTemplate = ({ firstName, otp }: { firstName: string, otp: string }) => {
  return (
    <div className='flex flex-col gap-y-4'>
        <h2 className='text-xl'>Hi {firstName}</h2>

        <p className='text-muted-foreground'>
          Your PIN reset otp is <b className="font-bold text-lg text-primary">{otp}</b>. Please safely ignore this email if you did not request for it.
        </p>

        <p className='text-muted'>isubscribe team, Nigeria.</p>
        <p><a href={process.env.NEXT_PUBLIC_SITE_URL}>Visit isubscribe website</a></p>
    </div>
  )
}

export default OTPTemplate