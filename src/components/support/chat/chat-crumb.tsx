import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { cn } from '@/lib/utils'
import { Tables } from '@/types/database'
import Image from 'next/image'
import React from 'react'

interface ChatCrumbProps {
    chat: Tables<'chats'> & { profile?: Tables<'profile'> | null },
    ref: React.RefObject<HTMLDivElement>
}

const ChatCrumb = ({chat: {role, message, profile, user_id, avatar}, ref}: ChatCrumbProps) => {
  const { data: user } = useGetProfile()
  const isSender = user?.data?.id === user_id
  return (
    <div className={cn("flex items-start gap-x-2 w-full", isSender && 'flex-row-reverse justify-end items-end')} ref={ref}>
        <Avatar className='border'>
            <AvatarImage src={(profile?.avatar! ?? avatar ?? '/users/profile-placeholder.png') } className='object-contain'/>
            <AvatarFallback content={profile?.full_name! ?? 'A'} />
        </Avatar>
        <div className={cn("flex-1", isSender && 'justify-end')}>
            <div className={cn("bg-secondary/90 rounded-xl px-4 md:px-6 p-2.5 w-fit", isSender && 'justify-end  bg-primary/90 text-white float-right')}>
                <p className="text-sm md:text-base">{message}</p>
            </div>
        </div>
    </div>
  )
}

export default ChatCrumb