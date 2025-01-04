import { Webhook } from "standardwebhooks";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { SupabaseAuthResponse } from "@/@types/supabase-auth";
import { sendSignupToken } from "@/components/templates/send-signup-token";
import { sendResetPasswordEmail } from "@/components/templates/send-reset-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const hookSecret = process.env.SEND_EMAIL_HOOK_SECRET as string;

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    const wh = new Webhook(hookSecret);

    const { user, email_data } = wh.verify(payload, headers) as SupabaseAuthResponse;

    switch (email_data.email_action_type) {
      case "signup":
        await resend.emails.send({
          from: "Welcome <no-reply@updates.isubscribe.ng>",
          to: [user.email],
          subject: "Verify Email",
          text: sendSignupToken({
            token: email_data.token,
            site_url: email_data.site_url,
            name: (user?.user_metadata as any)?.full_name || user.email,
          }),
        });
        return NextResponse.json({}, { status: 200 });

      case "reset_password":
        const resetPasswordLink = `${email_data.site_url}/auth/reset-password?token=${email_data.token}`;
        await resend.emails.send({
          from: "Support <no-reply@updates.isubscribe.ng>",
          to: [user.email],
          subject: "Reset Your Password",
          text: sendResetPasswordEmail({
            resetLink: resetPasswordLink,
            name: (user?.user_metadata as any)?.full_name || user.email,
          }),
        });
        return NextResponse.json({}, { status: 200 });

      default:
        return NextResponse.json({ error: "Invalid email action type" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      {
        error: {
          http_code: error.code || 500,
          message: error.message || "Internal Server Error",
        },
      },
      { status: 500 }
    );
  }
}
