'use client'

import DynamicModal from '@/components/DynamicModal'
import Empty from '@/components/Empty'
import LoadingOverlay from '@/components/loaders/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/funcs/formatDate'
import { useGetUserChatRooms } from '@/lib/react-query/funcs/chats'
import { cn } from '@/lib/utils'
import { LucideHistory } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

const Rooms = () => {
  const { data: rooms, isPending } = useGetUserChatRooms()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const roomId = searchParams.get('chat_room_id')

  if (isPending) return <LoadingOverlay loader='2' />
  return (
    <DynamicModal
      open={open}
      setOpen={setOpen}
      trigger={
        <Button size={'icon'} variant={'ghost'} className='bg-lime-600/15 text-lime-600'>
          <LucideHistory size={18} />
        </Button>
      }
    >
      <div className='p-2.5 flex flex-col gap-y-3 max-h-[75vh] overflow-y-auto'>
        <h2 className='text-lg md:text-xl font-semibold py-1.5 rounded-full'>Your Previous Chats</h2>

        {(rooms && rooms?.length > 0) ? <div className='flex flex-col gap-y-2.5'>
          {
            rooms?.map(room => (
              <Link
                key={room?.id}
                onClick={() => setOpen(false)}
                href={`/dashboard/support/chat?chat_room_id=${room?.id}`}
                className={cn('py-2 px-1 bg-secondary/10 border-b hover:bg-secondary/50 rounded-sm', roomId === room?.id && 'text-lime-500')}>
                  {room?.id} - <span className="font-semibold">{formatDateTime(room?.created_at)}</span>
                </Link>
            ))
          }
        </div> : (
          <Empty 
            icon={<LucideHistory size={18} />}
            color='green'
            className='bg-secondary dark:bg-inherit'
            title='You do not have any chat(s) yet.'
            content="Should you encounter any problem using iSubscribe, do not hesitate to reach out to us."
          />
        )}
      </div>
    </DynamicModal>
  )
}

export default Rooms