import * as React from "react";
import { Tailwind } from "@react-email/tailwind";
import { render } from "@react-email/render";
import Head from "next/head";
import Logo from "../Logo";
import { Zap } from "lucide-react";

interface ResetPasswordProps {
  resetLink: string;
  name: string;
}

const SendResetPasswordEmail = ({ resetLink, name }: ResetPasswordProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#6c1e99",
              foreground: "#0e0221",
              accent: "#fbbf24",
            },
          },
        },
      }}
    >
      <html>
        <Head>
          <title>Reset Password</title>
        </Head>
        <body className="bg-foreground text-white min-h-screen rounded-lg">
          <div className="max-w-md mx-auto my-8 bg-brand text-white rounded-lg shadow-lg p-6 h-full flex flex-col gap-y-4">
            <a href={process.env.NEXT_PUBLIC_SITE_URL} className="flex items-center gap-x-1.5 text-xl font-semibold flex-row">
              <Zap /> <span>isubscribe</span>
            </a>
            <header className="mb-6">
              <h1 className="text-lg mb-2">Hello, {name}!</h1>
              <p className="text-base text-white">
                You requested a password reset. Click the button below to reset your password.
              </p>
            </header>
            <main>
              <div className="text">
                <a
                  href={resetLink}
                  className="inline-block bg-accent text-black px-6 py-3 rounded-xl font-bold text-lg hover:bg-yellow-500/80 cursor-pointer transition-colors w-full text-center"
                >
                  Reset Password
                </a>
              </div>
              <p className="text-sm mt-4 text-white">
                If you {"didn’t"} request this, you can safely ignore this email.
              </p>
            </main>
            <footer className="mt-6">
              <p className="text-sm">
                Need help? Contact us at{" "}
                <a
                  href="mailto:support@updates.isubscribe.ng"
                  className="text-accent underline"
                >
                  support@updates.isubscribe.ng
                </a>
              </p>
              
              <div className="flex gap-4 mt-4">
                <a
                  href="https://twitter.com/isubscribe"
                  className="text-white hover:text-accent"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/isubscribe"
                  className="text-white hover:text-accent"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/isubscribe"
                  className="text-white hover:text-accent"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 mt-4">&copy; {new Date().getFullYear()} isubcribe.</p>
            </footer>
          </div>
        </body>
      </html>
    </Tailwind>
  );
};

export const sendResetPasswordEmail = (props: ResetPasswordProps) =>
  render(<SendResetPasswordEmail {...props} />);
