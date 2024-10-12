'use server'

import { createClient } from "@/utils/supabase/server"
import { Provider } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const signUp = async ({ email, password, metadata={} }: { email: string, password: string, metadata?: Record<string, string> }) => {
    const supabase = createClient()

    const { data: _user, error: _error } = await supabase.from('profile').select('id').eq('email', email).single()

    if (_user?.id) {
    throw new Error('User with this email already exists.')
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
        revalidatePath('/', 'layout')
        return redirect('/sign-in')
    } else {
        return redirect('/sign-in')
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
    })
    if (error) throw error
    return { data }
}