'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateChat, useGetUserChatRooms } from '@/lib/react-query/funcs/chats'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { Tables } from '@/types/database'
import { useMutationState, useQueryClient } from '@tanstack/react-query'
import { LucideSend } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const ChatInput = () => {
  const [message, setMessage] = React.useState('')
  const { mutate: createChat, isPending: creating } = useCreateChat()
  const queryClient = useQueryClient()

  const sP = useSearchParams()
  const chatRoomId = sP.get('chat_room_id')

  const variables = useMutationState<Tables<'chats'>>({
    filters: { mutationKey: [QueryKeys.create_chat, chatRoomId], status: 'pending' },
    select: (mutation) => mutation.state.variables as any,
  })

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
      setMessage('')
  }
  
  return (
    <div className="py-4 mt-3 w-full max-md:right-0 max-md:left-0 bottom-10 z-20 px-2.5 max-w-3xl mx-auto bg-inherit fixed backdrop-blur-lg rounded-lg">
        <div className="flex items-center gap-x-2 max-w-3xl mx-auto">
            <Input
                type="text"
                className="flex-1 border rounded-lg p-2 h-12 bg-background dark:bg-secondary dark:border-none"
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <Button onClick={handleSubmit} variant={'secondary'} disabled={creating} className="bg-primary/20 text-primary rounded-lg flex items-center justify-center text-center hover:opacity-70 h-12 p-4">
              <LucideSend size={16} />
            </Button>
        </div>
    </div>
  )
}

export default ChatInput