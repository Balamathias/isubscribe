import * as React from "react";
import { Tailwind } from "@react-email/tailwind";
import { render } from "@react-email/render";
import Head from "next/head";

interface Props {
  token: string;
  name: string;
  site_url: string;
}

const SendSignupToken = ({ token, name, site_url }: Props) => {
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
          <title>Sign Up Confirmation</title>
        </Head>
        <body className="bg-foreground text-gray-200">
          <div className="max-w-md mx-auto my-8 bg-brand text-white rounded-lg shadow-lg p-6">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome, {name}!</h1>
              <p className="text-lg">
                Thank you for signing up for <a href={site_url} className="text-accent underline">{site_url}</a>
              </p>
            </header>
            <main>
              <p className="text-lg mb-4">
                Use the following code to confirm your sign-up:
              </p>
              <div className="bg-accent text-black rounded-lg text-center p-4 text-2xl font-mono font-semibold tracking-wider">
                {token}
              </div>
              <p className="text-sm mt-4 text-center">
                If you {"didn’t"} request this, you can safely ignore this email.
              </p>
            </main>
            <footer className="text-center mt-6">
              <p className="text-sm">
                Need help? Contact us at{" "}
                <a
                  href={`mailto:support@${new URL(site_url).hostname}`}
                  className="text-accent underline"
                >
                  support@{new URL(site_url).hostname}
                </a>
              </p>
            </footer>
          </div>
        </body>
      </html>
    </Tailwind>
  );
};

export const sendSignupToken = (props: Props) => render(<SendSignupToken {...props} />);
