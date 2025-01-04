'use server'

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/lib/supabase/accounts'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  let next = searchParams.get("next") || "/auth/pass-pin";

  const { data: currentUser } = await getUser()
  if (currentUser?.onboarded && next === '/auth/pass-pin') {
    next = '/'
  }

  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      const redirectTo = new URL(next, request.url);
      redirectTo.searchParams.delete("token_hash");
      redirectTo.searchParams.delete("type");
      return NextResponse.redirect(redirectTo.toString());
    }
  }

  return NextResponse.redirect(new URL("/auth/error", request.url));
}












// Creating a handler to a GET request to route /auth/confirm
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const token = searchParams.get('token')
//   const token_hash = searchParams.get('token_hash')
//   console.log(token, token_hash)
//   const type = searchParams.get('type') as EmailOtpType | null
//   let next = '/auth/pass-pin'
//   const { data: currentUser } = await getUser()
//   if (currentUser?.onboarded) {
//     next = '/'
//   }

//   // Create redirect link without the secret token
//   const redirectTo = request.nextUrl.clone()
//   redirectTo.pathname = next
//   redirectTo.searchParams.delete('token_hash')
//   redirectTo.searchParams.delete('type')

//   if (token_hash && type) {
//     const supabase = createClient()
//     const { error,data } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     })
//     if (!error) {
//       redirectTo.searchParams.delete('next')
//       return NextResponse.redirect(redirectTo)
//     }
//   }

//   // return the user to an error page with some instructions
//   redirectTo.pathname = '/auth/error'
//   return NextResponse.redirect(redirectTo)
// }
