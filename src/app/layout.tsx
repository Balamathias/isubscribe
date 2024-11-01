import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Providers from "@/providers";
import { cn } from "@/lib/utils";

import Head from "next/head";

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
      <Head key="manifest">
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Determine the user's preferred color scheme
                  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.querySelector('link[rel="manifest"]').setAttribute('href', \`/api/manifest?theme=\${theme}\`);

                  // Update the manifest dynamically if the theme changes
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
                    const newTheme = event.matches ? 'dark' : 'light';
                    document.querySelector('link[rel="manifest"]').setAttribute('href', \`/api/manifest?theme=\${newTheme}\`);
                  });
                })();
              `,
            }}
          />
          <link rel="manifest" href="/api/manifest?theme=light" />
      </Head>
      <body className={cn('antialised', process.env.NODE_ENV === 'development' ? localPoppins.className : poppins.className)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
