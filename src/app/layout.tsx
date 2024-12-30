import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Providers from "@/providers";
import { cn } from "@/lib/utils";

import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({ subsets: ["latin"], weight: ['200', '300', '400', '500', '700'], variable: '--font-mont' });

const localPoppins = localFont({
  src: './fonts/poppins/Poppins-Regular.ttf',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "isubscribe",
  description: "A round-trip Virtual Top up platform for all your utility bills. Buy amazing data plans, airtime and electricity and earn bonuses",
  openGraph: {
    images: ['/badge.png']
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
      <body className={cn('antialised', process.env.NODE_ENV === 'development' ? localPoppins.className : poppins.className)}>
        <NextTopLoader 
          showSpinner={false}
          color="violet"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
