import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Providers from "@/providers";
import { cn } from "@/lib/utils";

// const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({ subsets: ["latin"], weight: ['200', '300', '400', '500', '700'], variable: '--font-mont' });

const localPoppins = localFont({
  src: './fonts/poppins/Poppins-Regular.ttf',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Isubscribe",
  description: "A round trip VTU platform to ace your utility bills with a single click.",
};

export default async function RootLayout({
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
