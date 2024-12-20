import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { render } from '@react-email/render'
import Head from 'next/head'
import { ClassValue } from 'clsx';
import clsx from 'clsx';


export interface EmailTemplateProps {
  email: string;
  subject?: string;
  message: string;
  links?: {label: string, href: string}[],
  name?: string;
  html?: React.ReactNode;
  title?: string,
  wrapperStyle?: ClassValue,
  linkStyle?: ClassValue,
}

const Email = ({
  email,
  wrapperStyle,
  links,
  linkStyle,
  message,
  html,
  title,
}: EmailTemplateProps) => {
  return (
    <Tailwind config={{ theme: { extend: { colors: { brand: '#007291' } } } }}>
      <html>
      <Head>
        <title>{ title || `Hello ${email}!` }</title>
      </Head>
      <div className={clsx("bg-white p-4 rounded-xl py-6 shadow-md", wrapperStyle)}>
        <h1 className={clsx("text-lg font-semibold text-brand")}>Hello {email}</h1>
        {
          message?.split('\n\n').map((line, i) => (
            <p className="py-1.5 leading-5" key={i}>{line}</p>
          ))
        }

        {html}

        {links?.length && (
          <div className="py-2">
            <h2 className="text-base py-1 font-semibold">Some helpful links</h2>
            {
            links?.map(({ label, href }) => (
              <a href={href} className={clsx("text-brand mt-1 mr-3 text-underline", linkStyle)} key={label}>{label}</a>
            ))
            }
          </div>
        )}

        <div className="flex flex-col gap-2">
          <a href={process.env.NEXT_PUBLIC_SITE_URL} className="text-brand rounded-md flex items-center justify-center shadow py-2 mt-4">Visit our Home page.</a>
        </div>
      </div>
      </html>
    </Tailwind>
  )
}

export default Email

export const renderEmailHTML = (props: EmailTemplateProps ) => render(<Email {...props} />)