import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { render } from '@react-email/render'
import Head from 'next/head'
import clsx from 'clsx';


export interface VerifyEmailTemplateProps {
  email: string;
  title?: string;
  link: {label?: string, href: string},
  message: string;
  username?: string;
}

const Email = ({
  email,
  link,
  message,
  username,
}: VerifyEmailTemplateProps) => {
  return (
    <Tailwind config={{ theme: { extend: { colors: { brand: '#007291' } } } }}>
      <html>
      <Head>
        <title>Verify Your email account</title>
      </Head>
      <div className={clsx("bg-white p-4 rounded-md")}>
        <h1 className={clsx("text-xl font-semibold text-brand")}>Hi {username || email}</h1>
        {
          message?.split('\n\n').map((line, i) => (
            <p className="py-1.5 leading-5" key={i}>{line}</p>
          ))
        }

        <a href={link.href} className={clsx("text-brand mt-1 mr-3 text-underline")} key={link.label}>{link.label || link.href || 'Verify Your email'}</a>

        <div className="flex flex-col gap-2">
          <a href={process.env.NEXT_PUBLIC_SITE_URL} className="bg-brand px-4 rounded-md flex items-center justify-center shadow text-slate-50 py-2 mt-4">Visit our Home page.</a>
        </div>
      </div>
      </html>
    </Tailwind>
  )
}

export const renderEmailHTML = (props: VerifyEmailTemplateProps ) => render(<Email {...props} />)