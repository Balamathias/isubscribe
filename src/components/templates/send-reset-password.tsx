import * as React from "react";
import { Tailwind } from "@react-email/tailwind";
import { render } from "@react-email/render";
import Head from "next/head";

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
        <body className="bg-foreground text-gray-200">
          <div className="max-w-md mx-auto my-8 bg-brand text-white rounded-lg shadow-lg p-6">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Hello, {name}!</h1>
              <p className="text-lg">
                You requested a password reset. Click the button below to reset your password.
              </p>
            </header>
            <main>
              <div className="text-center">
                <a
                  href={resetLink}
                  className="inline-block bg-accent text-black px-6 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors"
                >
                  Reset Password
                </a>
              </div>
              <p className="text-sm mt-4 text-center">
                If you {"didn’t"} request this, you can safely ignore this email.
              </p>
            </main>
            <footer className="text-center mt-6">
              <p className="text-sm">
                Need help? Contact us at{" "}
                <a
                  href="mailto:support@updates.isubscribe.ng"
                  className="text-accent underline"
                >
                  support@updates.isubscribe.ng
                </a>
              </p>
            </footer>
          </div>
        </body>
      </html>
    </Tailwind>
  );
};

export const sendResetPasswordEmail = (props: ResetPasswordProps) =>
  render(<SendResetPasswordEmail {...props} />);
