'use server'

import { hashPin } from "@/funcs/bcrypt"
import { sendOtpEmail } from "@/funcs/sendOTPEmail"
import { createClient } from "@/utils/supabase/server"
import { Provider } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const signUp = async ({ email, password, metadata={} }: { email: string, password: string, metadata?: Record<string, string> }) => {
    const supabase = createClient()

    const { data: _user, error: _error } = await supabase.from('profile').select('id').eq('email', email).single()

    if (_user?.id) {
        return { error: { message: `User with this email - ${email} already exists.` } }
    }

    const {data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata
        }
    })
    if (error) throw error
    revalidatePath('/', 'layout')
    return { message: 'Account created successfully.', status: 200, statusText: 'OK', data:data}
}

export const signIn = async ({ email, password }: { email: string, password: string }) => {
    const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        revalidatePath('/', 'layout')
        return { message: 'Signed in successfully.', status: 200, statusText: 'OK' }
}

export const signOut = async () => {
    const supabase = createClient()
    const { data: { user } } = await getCurrentUser()
    if (user) {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        revalidatePath('/dashboard', 'layout')
        return redirect('/dashboard')
    } else {
        return redirect('/dashboard')
    }
}

export const signInWithOAuth = async (provider?: Provider) => {
    const supabase = createClient()
    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: provider || 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL!}/auth/callback?next=/auth/pass-pin`,
        },
    })

    if (error) throw error

    return redirect(data.url)
}

export const getCurrentUser = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        console.error(error)
        return { data: { user: null }}
    }
    return { data }
}

export const resetPasswordForEmail = async (email: string) => {
    const supabase = createClient()
    const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`
    })

    if (error) throw error
    return
}

export const updateAuthUser = async (password: string, metadata?: Record<string, string>) => {
    const supabase = createClient()

    const {data,error} = await supabase.auth.updateUser({
        password,
        email: metadata?.email,
    })
    console.error(error)
    if (error) return { error: { message: error?.message } }
    return { data }
}

export const getUserPin = async () => {
    const supabase = createClient()

    const { data: { user } } = await getCurrentUser()

    if (user && user?.id) {
        const { data, error } = await supabase.from('profile').select('pin').eq('id', user?.id).single()

        if (error) {
            return {
                error: {
                    message: error?.message
                }
            }
        }

        return { data, pin: data?.pin }
    } else {
        return { data: null, pin: null }
    }
}

export const validateResetPasswordOTP = async (token: string, email: string) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.verifyOtp({token, email, type: 'recovery'})

    console.error(error, token, email)

    
    if (error || !data) return { data: null, error: { message: error?.message } }
    
    await supabase.auth.setSession({ access_token: data?.session?.access_token!, refresh_token: data?.session?.refresh_token! })

    return { data, error: null }
}

const getValidOtpForUser = async (userId: string) => {

    const supabase = createClient()

    const { data, error } = await supabase
        .from('otp_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single()

    if (error) {
        console.error(error)
        return null
    }

    return data ? data : null;
};


export const sendResetPinOTP = async () => {

    const generateOtp = () => {
        return Math.floor((Math.random() * 89999) + 10000).toString();
    };

    const otp = generateOtp()

    const supabase = createClient()

    const { data: { user } } = await getCurrentUser()

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    if (!user || !user?.id) {
        return {
            error: {
                message: 'You must be signed in to request a reset pin'
            }
        }
    }

    let validOTP = await getValidOtpForUser(user?.id)

    if (!validOTP) {
        const { error, data } = await supabase
        .from('otp_requests')
        .insert([{ user_id: user?.id, otp, expires_at: expiresAt, }])
        .select()
        .single()

        validOTP = data

        if (error) throw new Error(`Error storing OTP: ${error.message}`);
    }

    sendOtpEmail(user?.email!, validOTP?.otp!, user?.user_metadata?.full_name || user?.email!)
};

export const resetPin = async (newPin: string) => {
    const supabase = createClient()

    const { data: { user } } = await getCurrentUser()

    if (!user || !user?.id) {
        return {
            error: {
                message: 'You must be signed in to request a reset pin'
            }
        }
    }

    const hashedPin = await hashPin(newPin)

    const { error } = await supabase
        .from('profile')
        .update({ pin: hashedPin })
        .eq('id', user.id);

    if (error) throw new Error(`Error resetting pin: ${error.message}`);
};

export const verifyResetPinOtp = async (otp: string) => {

    const supabase = createClient()

    const { data: { user } } = await getCurrentUser()

    if (!user || !user?.id) {
        return false
    }

    const { data, error } = await supabase
        .from('otp_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('otp', otp)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();


    if (error || !data) {
        console.log(error)
        return false
    }
    
    await supabase
        .from('otp_requests')
        .delete()
        .eq('user_id', user.id)
        .eq('otp', otp)
    
    return true;
};

export const setUserRating = async (rating: number, comment: string) => {
    const supabase = createClient()

    const { data: { user } } = await getCurrentUser()

    if (!user) {
        return {
            error: {
                message: 'User not found, please log in'
            },
            data: null
        }
    }

    const { data, error } = await supabase.from('ratings').insert([{ user_id: user.id, rating, comment }]).select().single()

    if (error) {
        console.log(error)
    }

    return { data, error }
}