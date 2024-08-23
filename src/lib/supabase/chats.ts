'use server'

import { createClient } from "@/utils/supabase/server"
import { getCurrentUser } from "./user.actions"
import { getUser } from "./accounts"

const ADMIN_EMAILS = [
    'balamathias05@gmail.com',
    'balaladalo@gmail.com'
]

export const createChatRoom = async () => {
    const supabase = createClient()

    const { data: user } = await getUser()

    const { data, error } = await supabase.from('chat_room')
        .insert({
            user_id: user?.id,
        })
        .select().single()
    
    if (error) {
        throw error
    }

    return data
}

export const getUserChatRooms = async () => {
    const supabase = createClient()

    const { data: user } = await getUser()

    const { data, error } = await supabase.from('chat_room')
        .select(`*`)
        .eq('user_id', user?.id!)
    
    if (error) {
        throw error
    }

    return data
}

export const getUserChats = async ({chat_room_id}: { chat_room_id: string }) => {
    const supabase = createClient()

    const { data: user } = await getCurrentUser()

    const { data, error } = await supabase.from('chats')
        .select(`
            *,
            profile (*)
        `)
        .eq('chat_room', chat_room_id)
        .order('created_at', {ascending: true})
        .limit(40)

    if (error) {
        throw error
    }

    return data
}

export const createChat = async (chat: {user_id?: string, message: string, room_id: string}) => {
    const supabase = createClient()
    const { data: user } = await getUser()

    const { data, error } = await supabase.from('chats')
        .insert({
            message: chat?.message,
            user_id: user?.id,
            chat_room: chat.room_id,
            role: ADMIN_EMAILS.includes(user?.email as string) ? 'admin' : 'user' 
        })

    if (error) {
        throw error
    }

    return data
}