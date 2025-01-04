import { Webhook } from "standardwebhooks";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { SupabaseAuthResponse } from "@/@types/supabase-auth";
import { sendSignupToken } from "@/components/templates/send-signup-token";
import { sendResetPasswordEmail } from "@/components/templates/send-reset-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const hookSecret = process.env.SEND_EMAIL_HOOK_SECRET as string;
const site_url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    const wh = new Webhook(hookSecret);

    const { user, email_data } = wh.verify(payload, headers) as SupabaseAuthResponse;
    console.log("user: ", user, "data: ", email_data)

    switch (email_data.email_action_type) {
      case "signup":
        await resend.emails.send({
          from: "Welcome <no-reply@updates.isubscribe.ng>",
          to: [user.email],
          subject: "Verify Email",
          html: sendSignupToken({
            token: email_data.token,
            site_url,
            name: (user?.user_metadata as any)?.full_name || user.email,
          }),
        });
        return NextResponse.json({}, { status: 200 });

      case "reset_password":
        const resetPasswordLink = `${site_url}/auth/confirm?token=${email_data.token}&token_hash=${email_data.token_hash}&type=${email_data.email_action_type}&redirectTo=${email_data.redirect_to}/auth/reset-password?email=${user?.email}`;
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

      case "recovery":
        const recoveryLink = `${site_url}/auth/confirm?token=${email_data.token}&token_hash=${email_data.token_hash}&type=${email_data.email_action_type}&redirectTo=${email_data.redirect_to}/auth/reset-password?email=${user?.email}`;
        await resend.emails.send({
          from: "Support <no-reply@updates.isubscribe.ng>",
          to: [user.email],
          subject: "Reset Your Password",
          html: sendResetPasswordEmail({
            resetLink: recoveryLink,
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
