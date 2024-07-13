import React from 'react'
import DynamicSheet from '../DynamicSheet'

const PrivacyPolicy = () => {
  return (
    <DynamicSheet 
    trigger={ 
    <div className='text-muted-foreground text-xs sm:text-sm itali text-center underline cursor-pointer hover:text-violet-600'
    >
       <p>Privacy Policy</p>
    </div>}
    className={" md:min-w-[460px] w-full"}
     >
    <div className=' flex flex-col gap-6'>
     <h2 className='text-muted-foreground text-[14px] font-semibold text-nowrap'>Privacy Policy.</h2>
     <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            At iSubscribe Network (https://isubscribe.ng), your privacy is paramount to us. We are committed to respecting your privacy and complying with any applicable law and regulation regarding any personal information we may collect about you, across our website and other sites we own and operate.
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            This policy is effective as of [effective date] and was last updated on [last update date].
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Information We Collect
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We collect both information you knowingly provide to us when using our services and promotions, and information that your devices automatically send while accessing our products and services.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Log Data
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    When you visit our website (https://isubscribe.com), our servers may log standard data provided by your web browser. This data may include your device's Internet Protocol (IP) address, browser type and version, the pages you visit, the time and date of your visit, and other details about your visit. While this information may not identify you personally by itself, it could be combined with other data to do so.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Personal Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We may request personal information such as:
                    <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>Name</li>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>Email address</li>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>Phone/mobile number</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Legitimate Reasons for Processing Your Personal Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We collect and use your personal information only when we have a legitimate reason to do so. In such instances, we only gather information that is reasonably necessary to provide our services to you.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Collection and Use of Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We may collect personal information from you when you:
                    <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>Access our content using a mobile device or web browser</li>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>Contact us via email, social media, or similar technologies</li>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>Mention us on social media</li>
                    </ul>
                </li>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We may collect, hold, use, and disclose information for the following purposes, and will not process personal information in ways that are incompatible with these purposes:
                    <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>To contact and communicate with you</li>
                        <li className='text-muted-foreground text-xs sm:text-sm italic'>For marketing and advertising, including sending promotional information about our products and services, and information about third parties we think may be of interest to you</li>
                    </ul>
                </li>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We may combine the information we collect about you with general information or research data from other trusted sources.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Payments
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We use Paystack and Monnify for payment processing. When processing payments, some of your data will be shared with these companies, including information necessary to process or support the payment, such as purchase total and billing information.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Security of Your Personal Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We take commercially acceptable steps to protect the personal information you provide to us from loss, theft, unauthorized access, disclosure, copying, use, or modification. However, no method of electronic transmission or storage is 100% secure, so we cannot guarantee absolute data security.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            How Long We Keep Your Personal Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We retain your personal information only as long as necessary for the purposes set out in this privacy policy. If your personal information is no longer needed, we will delete it or anonymize it by removing identifying details. However, we may retain your personal information for compliance with legal, accounting, or reporting obligations, or for public interest archiving, scientific, or historical research, or statistical purposes.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Children&apos;s Privacy
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We do not target our services directly at children under the age of 13, and we do not knowingly collect personal information from children under 13.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Disclosure of Personal Information to Third Parties
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We will not share your personal or contact information with anyone except as described in this policy.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            International Transfers of Personal Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    Personal information we collect may be stored and processed in locations where we or our partners, affiliates, and third-party providers maintain facilities. These locations may not have the same data protection laws as your jurisdiction. If we transfer your personal information to third parties in other countries, we will perform those transfers in accordance with applicable laws and protect the transferred personal information as described in this privacy policy.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Your Rights and Controlling Your Personal Information
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    You have the right to withhold personal information from us, understanding that this may affect your experience on our website. We will not discriminate against you for exercising any of your rights over your personal information. If you provide personal information, you agree that we can collect, hold, use, and disclose it according to this privacy policy. You retain the right to request details of any personal information we hold about you.
                </li>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    If you receive personal information about you from a third party, we will protect it as outlined in this privacy policy. If you provide personal information about others, you must have their consent to do so.
                </li>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    You can change your mind about us using your personal information for direct marketing at any time by contacting us or using the opt-out options provided in our communications. We may need to verify your identity before processing your request.
                </li>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    If you believe that any information we hold about you is inaccurate, outdated, incomplete, irrelevant, or misleading, please contact us. We will take reasonable steps to correct any information found to be incorrect.
                </li>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    If you believe we have breached data protection laws and want to make a complaint, please contact us with full details of the alleged breach. We will investigate promptly and respond in writing with the outcome and steps we will take. You also have the right to contact a regulatory body or data protection authority.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Use of Cookies
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer and retrieves each time you visit, helping us understand how you use our site and serving content based on your preferences.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Limits of Our Policy
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    Our website may link to external sites that we do not operate. We are not responsible for the content or policies of these sites, and we cannot accept liability for their privacy practices.
                </li>
            </ul>
        </li>
        <li className='text-muted-foreground text-xs sm:text-sm'>
            Changes to This Policy
            <ul className='flex flex-col space-y-3 justify-end list-decimal px-4 marker:text-violet-600 marker:font-bold'>
                <li className='text-muted-foreground text-xs sm:text-sm'>
                    We may update our privacy policy to reflect changes to our business processes, acceptable practices, or legal and regulatory requirements. If we make changes, we will post them here at the same link. Where required by law, we will seek your consent or provide you with the opportunity to opt in or out of new uses of your personal information.
                </li>
            </ul>
        </li>
    </ul>

    </div>
     </DynamicSheet>
  )
}

export default PrivacyPolicy