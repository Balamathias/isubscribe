'use client'

import { Button } from '@/components/ui/button'
import { useCreateChatRoom } from '@/lib/react-query/funcs/chats'
import { QueryKeys } from '@/lib/react-query/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'

const NewChatButton = () => {
  const { mutate: createChatRoom, isPending: creatingChatRoom } = useCreateChatRoom()
  const router = useRouter() 
  const queryClient = useQueryClient()

  return (
    <div className='flex items-center justify-center'>
      <Button 
        onClick={() => {
            createChatRoom(undefined, {
                onSuccess: (data) => {
                    router.replace('?chat_room_id=' + data?.id )
                    queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats]})
                    queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, data?.id]})
                }
            })
        }}
        disabled={creatingChatRoom}
        variant={'default'}
        className='rounded-xl p-4 py-5 bg-primary/20 text-primary dark:text-gray-100 w-fit'
    >Start a New Chat</Button>
    </div>

  )
}

export default NewChatButton