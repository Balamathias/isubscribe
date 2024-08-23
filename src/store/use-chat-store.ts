import { Tables } from '@/types/database'
import { create } from 'zustand'

type Chat = {
    chats: Tables<'chats'>[],
    addChat: (chat: Tables<'chats'>) => void,
    setChats: (chats: Tables<'chats'>[]) => void
}

export const useChatStore = create<Chat>((set) => ({
    chats: [],
    addChat: (chat) => set((state) => ({chats: [...state.chats, chat]})),
    setChats: (chats) => set((state) => ({ chats: [...chats]})),
}))