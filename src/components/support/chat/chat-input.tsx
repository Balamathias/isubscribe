'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateChat, useGetUserChatRooms } from '@/lib/react-query/funcs/chats'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const ChatInput = () => {
  const [message, setMessage] = React.useState('')
  const { mutate: createChat, isPending: creating } = useCreateChat()
  const queryClient = useQueryClient()

  const sP = useSearchParams()
  const chatRoomId = sP.get('chat_room_id')

  const handleSubmit = () => {
    if (!message) return toast.info('Please type a message before sending.')
      if (!chatRoomId) return toast.info('Please Start a New Chat.')

    createChat({message, room_id: chatRoomId}, {
      onSuccess: () => {
        setMessage('')
        queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, chatRoomId]})
      },
      onError: (error) => {
        toast.error('An error occurred while sending your message, please try again.')
        // toast.error(error?.message)
      }
    })
  }
  
  return (
    <div className="py-4 mt-3 w-full right-0 left-0">
        <div className="flex items-center gap-x-2 max-w-3xl">
            <Input
                type="text"
                className="flex-1 border rounded-lg p-2 h-12 bg-background dark:bg-secondary dark:border-none"
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <Button onClick={handleSubmit} variant={'secondary'} disabled={creating} className="bg-primary/20 text-primary rounded-lg flex items-center justify-center text-center hover:opacity-70 h-12 p-4">Send</Button>
        </div>
    </div>
  )
}

export default ChatInput