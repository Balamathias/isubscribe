'use server'

import { createClient } from "@/utils/supabase/server";
import { createReferral } from "./share";

export async function verifyOtp(payload:any) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    email: payload?.email,
    token: payload?.otp,
    type: 'email'
  })

  if (error) {
    console.log(error)
    return { error: error.message };
  }

  if (data && data?.user?.id && payload?.referrer) {
    await createReferral({ referrer: payload?.referrer, referred: data?.user?.id, status: 'pending', reward: 100 })
  }

  console.log("ddddd", data)
  console.log("errrr", error)

  // Ensure the response data is a plain object
  return { data: data || null, error: error || null }
}



export async function resendOtp(payload:any) {
  const supabase = createClient()

  const { error, data  } = await supabase.auth.resend({
    type: 'signup',
    email: payload?.email,
   
  })

  if (error) {
    return { error: error.message };
  }

  console.log("ddddd", data)
  console.log("errrr", error)

  // Ensure the response data is a plain object
  return { data: data || null, error: error || null }
}



