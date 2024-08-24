'use client'

import React, { useEffect } from 'react'
import ChatCrumb from './chat-crumb'
import ChatInput from './chat-input'
import { useCreateChatRoom, useGetUserChats } from '@/lib/react-query/funcs/chats'
import { Role } from '@/types/constants'
import SkeletonChat from '@/components/skeletons/skeleton-chat'
import Empty from '@/components/Empty'
import { LucidePhone } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Tables } from '@/types/database'
import { useMutationState, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { useRouter, useSearchParams } from 'next/navigation'
import NewChatButton from './new-chat'

interface ChatInterfaceProps {
    profile?: Tables<'profile'>,
    chats?: Tables<'chats'>
}

const ChatInterface = ({profile}: ChatInterfaceProps) => {

  const sP = useSearchParams()
  const chatRoomId = sP.get('chat_room_id')
  const { data: chats, isPending: getting } = useGetUserChats({chat_room_id: chatRoomId!})

  const queryClient = useQueryClient()

  const router = useRouter()
  const moveChatDownWhileChattingRef = React.useRef<HTMLDivElement>(null)
  const chatBoxRef = React.useRef<HTMLDivElement>(null)

  const variables = useMutationState<Tables<'chats'>>({
    filters: { mutationKey: [QueryKeys.create_chat, chatRoomId], status: 'pending' },
    select: (mutation) => mutation.state.variables as any,
  })


  /** @note Point of Note: Currently using @broadcast ... I might switch to @presence later! */
  useEffect(() => {
    const supabase = createClient()
    chatBoxRef.current?.scrollIntoView({behavior: 'smooth'})
    moveChatDownWhileChattingRef.current?.scrollIntoView({behavior: 'smooth'})
    const chatChannel = supabase.channel('chat-insert-channel')
    .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats', filter: `chat_room=eq.${chatRoomId}` },
        (payload) => {
            if (payload.new) {
                const response = payload?.new as Tables<'chats'>
                if (response) {
                    moveChatDownWhileChattingRef.current?.scrollIntoView({behavior: 'smooth'})
                    queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats]})
                    queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, response?.chat_room]})
                    queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, profile?.id]})
                }
            }
        }
    )
    .subscribe()

    return () => { supabase.removeChannel(chatChannel) }
}, [chatRoomId, queryClient])

  if (getting) return <SkeletonChat />

  if (!chats || chats.length === 0) return (
    <div className='flex flex-col gap-y-5 py-4'>
        <Empty 
            title='How can we help you today?'
            color='green'
            content='Start a chat with us to get help. We are always here to help you.'
            icon={<LucidePhone size={16} />}
            className='bg-inherit dark:bg-inherit'
        />
        <ChatInput />
    </div>
  )

  return (
    <>
        {chatRoomId ? <div className="flex flex-col dark:bg-inherit py-5 dark:px-0 rounded-xl">
            <div className="flex-1 overflow-y-auto flex-col h-screen">
                <div className="flex flex-col gap-y-4 mb-16">
                    {chats?.map((chat, index) => (
                        <ChatCrumb 
                            key={index} 
                            chat={chat}
                            ref={moveChatDownWhileChattingRef}
                        />
                    ))}
                </div>

            </div>
            <ChatInput />
            <div ref={moveChatDownWhileChattingRef} />
        </div>: (
            <NewChatButton />
        )}
    </>
  )
}

export default ChatInterface