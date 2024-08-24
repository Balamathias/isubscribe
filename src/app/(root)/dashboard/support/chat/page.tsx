import ChatInterface from '@/components/support/chat/chat-interface'
import NewChatButton from '@/components/support/chat/new-chat'
import Rooms from '@/components/support/chat/rooms'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import { updateChatRoomParticipants } from '@/lib/supabase/chats'
import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "iSubscribe Support | Live Chat",
  description: "What problems are you facing using iSubscribe? Chat us up now to rectify them."
}

const Page = async ({ searchParams }: { searchParams: Record<string, any>}) => {
  const params = new URLSearchParams(searchParams)
  const roomId = params.get('chat_room_id')
  await updateChatRoomParticipants(roomId!)
  
  return (
    <WidthWrapper className='!max-w-3xl mt-16 md:py-12 overflow-hidden'>
        <div className='w-full flex-1 float-right flex items-center justify-between'>
          <Rooms />
          <NewChatButton />
        </div>
        <ChatInterface />
    </WidthWrapper>
  )
}

export default Page