import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { supabaseKey, supabaseURL } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";
  const email = searchParams.get("email");

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      createClient(supabaseURL!, supabaseKey!),
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the `next` parameter or default to root
      const redirectTo = new URL(next, request.url);
      if (email) redirectTo.searchParams.set("email", email);
      return NextResponse.redirect(redirectTo.toString());
    }
  }

  return NextResponse.redirect("/auth/auth-code-error");
}
