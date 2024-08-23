import { createChat, createChatRoom, getUserChatRooms, getUserChats } from "@/lib/supabase/chats";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../query-keys";

export const useGetUserChats = ({chat_room_id}: { chat_room_id: string }) => useQuery({
    queryKey: [QueryKeys.get_user_chats, chat_room_id],
    queryFn: () => getUserChats({chat_room_id}),
})

export const useCreateChat = () => useMutation({
    mutationKey: [QueryKeys.create_chat],
    mutationFn: (chat: {user_id?: string, message: string, room_id: string}) => createChat(chat),
})

export const useGetUserChatRooms = () => useQuery({
    queryKey: [QueryKeys.get_user_chat_rooms],
    queryFn: () => getUserChatRooms(),
})

export const useCreateChatRoom = () => useMutation({
    mutationKey: [QueryKeys.create_chat_room],
    mutationFn: () => createChatRoom(),
})