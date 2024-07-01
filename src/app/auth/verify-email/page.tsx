import WidthWrapper from '@/components/WidthWrapper'
import { LucideCheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const VerifyEmailPage = ({ params, searchParams }: { params: {}, searchParams: { [key: string]: string } }): JSX.Element => {
    const urlParams = new URLSearchParams(searchParams)
    const token = urlParams.get('token')
    const email = urlParams.get('email')

    // Send a request to the server to ensure that the code is equal to the temporary verification code stored in the database along with a new sign up.
    // If the code is correct, the user is verified and the email is updated to verified in the database.
    // Show a spinner while verification is going on.
    // redirect to home page after verification is successful.

    return (
        <WidthWrapper className="min-h-screen">
            <div className="flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                    <LucideCheckCircle size={32} className="text-green-500" />
                    <p className="text-muted-foreground">Verified</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-muted-foreground">Your email &quot;{email}&quot; has been verified.</p>
                    <Link href='/' className='text-primary'>Go back home</Link>
                </div>
            </div>.
        </WidthWrapper>
    )
}

export default VerifyEmailPage