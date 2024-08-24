import { createChat, createChatRoom, getUserChatRooms, getUserChats } from "@/lib/supabase/chats";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";
import { useSearchParams } from "next/navigation";

const queryClient = new QueryClient()

export const useGetUserChats = ({chat_room_id}: { chat_room_id: string }) => useQuery({
    queryKey: [QueryKeys.get_user_chats, chat_room_id],
    queryFn: () => getUserChats({chat_room_id}),
})

export const useCreateChat = () => {
    const params = useSearchParams()
    const roomId = params.get('chat_room_id')
    return useMutation({
        mutationKey: [QueryKeys.create_chat, roomId],
        onSettled: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.get_user_chats, roomId] }),
        mutationFn: (chat: {user_id?: string, message: string, room_id: string}) => createChat(chat),
    })
}

export const useGetUserChatRooms = () => useQuery({
    queryKey: [QueryKeys.get_user_chat_rooms],
    queryFn: () => getUserChatRooms(),
})

export const useCreateChatRoom = () => useMutation({
    mutationKey: [QueryKeys.create_chat_room],
    mutationFn: () => createChatRoom(),
})