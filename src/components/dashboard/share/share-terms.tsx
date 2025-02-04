import DynamicModal from '@/components/DynamicModal'
import React from 'react'

const ShareTerms = () => {
  return (
    <DynamicModal trigger={<button className='font-semibold hover:text-primary underline'>Terms</button>} title='Share Terms' dialogClassName='!max-w-[60vw]'>
        <div className="flex flex-col gap-4 text-sm max-h-[70vh] overflow-y-auto pr-4 w-full">
            <section>
                <h3 className="text-lg font-semibold mb-2">How Share &amp; Earn Works</h3>
                <p>Our Share &amp; Earn program rewards you for inviting friends to join isubscribe. Here&apos;s how it works:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Share your unique referral link with friends and family</li>
                    <li>When they sign up using your link, they become your referral</li>
                    <li>Once they make their first transaction, you earn a 300MB data bonus</li>
                    <li>The bonus is automatically credited to your cashback wallet once claimed.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">Terms &amp; Conditions</h3>
                <ul className="list-disc ml-6 space-y-1">
                    <li>You must have an active isubscribe account to participate</li>
                    <li>Referral bonuses are only awarded for new user sign-ups</li>
                    <li>The referred user must complete a transaction within 72 hours of signing up</li>
                    <li>You cannot refer yourself or existing isubscribe users</li>
                    <li>Referral bonuses will be credited within 24 hours of qualifying transaction</li>
                    <li>Maximum of 50 successful referrals per user per month</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">Bonus Usage</h3>
                <ul className="list-disc ml-6 space-y-1">
                    <li>Data bonuses can be used for any data purchase on isubscribe</li>
                    <li>Bonuses in your cashback wallet are valid for 30 days</li>
                    <li>Minimum withdrawal/usage amount is 100 MB</li>
                    <li>Bonuses cannot be converted to cash or transferred</li>
                </ul>
            </section>

            <p className="text-xs text-muted-foreground mt-4">
                Note: isubscribe reserves the right to modify or terminate the Share &amp; Earn program at any time. Any suspected fraud or abuse of the program will result in immediate account suspension.
            </p>
        </div>
    </DynamicModal>
  )
}

export default ShareTerms
