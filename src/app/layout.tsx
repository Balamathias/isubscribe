import type { Metadata } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

// const montserrat = Montserrat({ subsets: ["latin"], weight: ['200', '300', '400', '500', '700'], variable: '--font-mont' });
const poppins = Poppins({ subsets: ["latin"], weight: ['200', '300', '400', '500', '700'], variable: '--font-mont' });

export const metadata: Metadata = {
  title: "Isubscribe",
  description: "A round trip VTU platform to ace your utility bills with a single click.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('antialised', inter.className, poppins.className,)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
