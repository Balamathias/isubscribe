import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Providers from "@/providers";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react"

import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({ subsets: ["latin"], weight: ['200', '300', '400', '500', '700'], variable: '--font-mont' });

const localPoppins = localFont({
  src: './fonts/poppins/Poppins-Regular.ttf',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "isubscribe Nigeria - Your One-Stop VTU Platform for Utility Bills & Airtime",
  description: "Nigeria's trusted platform for instant utility bill payments, data plans, airtime recharge, electricity bills, and TV subscriptions. Earn cashback rewards on every transaction.",
  keywords: "VTU, airtime recharge, data plans, utility bills, Nigeria, mobile top-up, bill payment, cashback rewards, electricity bills, TV subscription",
  openGraph: {
    title: "isubscribe Nigeria - Your One-Stop VTU Platform",
    description: "Instantly pay bills, buy data plans & airtime with cashback rewards",
    images: ['/opengraph/og-1.jpeg', '/opengraph/og-2.jpeg',  '/opengraph/og-3.jpeg'],
    type: "website",
    locale: "en_NG",
    siteName: "isubscribe Nigeria"
  },
  twitter: {
    card: "summary_large_image",
    title: "isubscribe Nigeria - Your One-Stop VTU Platform",
    description: "Instantly pay bills, buy data plans & airtime with cashback rewards",
    images: ['/opengraph/og-1.jpeg', '/opengraph/og-2.jpeg',  '/opengraph/og-3.jpeg'],
  },
  alternates: {
    canonical: "https://isubscribe.ng"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="8sxVKkOiQZcmefzduMerO9nrQnbfXwpMUyeStsODBSM" />
      </head>
      <body className={cn('antialised selection:bg-sky-600/20 selection:text-sky-500', process.env.NODE_ENV === 'development' ? localPoppins.className : poppins.className)}>
        <NextTopLoader 
          showSpinner={false}
          color="violet"
        />
        <Analytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
