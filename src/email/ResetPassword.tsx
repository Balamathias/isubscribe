import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { render } from '@react-email/render'
import Head from 'next/head'
import clsx from 'clsx';


export interface ResetPasswordEmailTemplateProps {
  email: string;
  title?: string;
  link?: {label?: string, href: string},
  message: string;
  username?: string;
}

const ResetPasswordEmail = ({
  email,
  link,
  message,
  username,
}: ResetPasswordEmailTemplateProps) => {
  return (
    <Tailwind config={{ theme: { extend: { colors: { brand: '#007291' } } } }}>
      <html>
      <Head>
        <title>Reset Your password</title>
      </Head>
      <div className={clsx("bg-white p-4 rounded-md")}>
        <h1 className={clsx("text-xl font-semibold text-brand")}>Hi {username || email}</h1>
        {
          message?.split('\n\n').map((line, i) => (
            <p className="py-1.5 leading-5" key={i}>{line}</p>
          ))
        }

        <div className="flex flex-col gap-2">
          <a href={link?.href} className="text-brand py-2 mt-4 underline">{link?.label || 'Reset my password'}</a>
        </div>
        <p className="text-sm text-muted-foreground">
            If you did not ask for this, please <a href={process.env.NEXT_PUBLIC_SITE_URL + '/auth/account/secure?email=' + email}className='text-violet-500 underline'>
                secure your account.
            </a>
        </p>

        <p className="text-sm text-muted-foreground">
            If you have any questions, please contact us at <a href='mailto:balamathias05@gmail.com' className='text-violet-500 underline'>
                Our Inbox
            </a>
        </p>

        <div className="flex flex-col gap-2">
          <a href={process.env.NEXT_PUBLIC_SITE_URL} className="text-brand py-2 mt-4 underline">Visit our Home page. &copy; matiecodes.tech</a>
        </div>
      </div>
      </html>
    </Tailwind>
  )
}

export const renderEmailHTML = (props: ResetPasswordEmailTemplateProps ) => render(<ResetPasswordEmail {...props} />)