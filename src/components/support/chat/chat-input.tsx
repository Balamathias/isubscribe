'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateChat, useCreateChatRoom, useGetUserChatRooms } from '@/lib/react-query/funcs/chats'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { updateChatRoomParticipants } from '@/lib/supabase/chats'
import { Tables } from '@/types/database'
import { useMutationState, useQueryClient } from '@tanstack/react-query'
import { LucideSend } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const ChatInput = () => {
  const [message, setMessage] = React.useState('')
  const { mutate: createChat, isPending: creating } = useCreateChat()
  const queryClient = useQueryClient()

  const sP = useSearchParams()
  const chatRoomId = sP.get('chat_room_id')

  const { mutate: createChatRoom, isPending: creatingChatRoom } = useCreateChatRoom()
  const router = useRouter() 

  const handleCreateRoom = () => {
    createChatRoom(undefined, {
        onSuccess: async (data) => {
          queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats]})
          queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, data?.id]})
          await updateChatRoomParticipants(chatRoomId!)
          createChat({message, room_id: data?.id!})
          router.replace('?chat_room_id=' + data?.id )
        }
    })
}

  const handleSubmit = () => {
    if (!message) return toast.info('Please type a message before sending.')
      if (!chatRoomId) {
        handleCreateRoom()
        setMessage('')
        return
      }

      createChat({message, room_id: chatRoomId!}, {
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
    <div className="py-4 mt-3 w-full max-md:right-0 max-md:left-0 bottom-16 md:bottom-0 z-20 px-2.5 max-w-3xl mx-auto bg-inherit fixed backdrop-blur-lg rounded-lg">
        <div className="flex items-center gap-x-2 max-w-3xl mx-auto md:mb-3">
            <Input
                type="text"
                className="flex-1 border rounded-lg p-2 h-12 bg-background/50 dark:bg-secondary/40 dark:border-none"
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
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