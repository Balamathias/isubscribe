import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetProfile } from '@/lib/react-query/funcs/user'
import { cn } from '@/lib/utils'
import { Tables } from '@/types/database'
import Image from 'next/image'
import React from 'react'

interface ChatCrumbProps {
    chat: Tables<'chats'> & { profile: Tables<'profile'> | null },
    ref: React.RefObject<HTMLDivElement>
}

const ChatCrumb = ({chat: {role, message, profile}, ref}: ChatCrumbProps) => {
  const { data: user } = useGetProfile()
  return (
    <div className={cn("flex items-start gap-x-2 w-full", role === 'user' && 'flex-row-reverse justify-end items-end')} ref={ref}>
        <Avatar>
            <AvatarImage src={profile?.avatar!} />
            <AvatarFallback content={profile?.full_name!} />
        </Avatar>
        <div className={cn("flex-1", role === 'user' && 'justify-end')}>
            <div className={cn("bg-secondary/90 rounded-xl px-4 md:px-6 p-2.5 w-fit", role === 'user' && 'justify-end  bg-primary/90 text-white float-right')}>
                <p className="text-sm md:text-base">{message}</p>
            </div>
        </div>
    </div>
  )
}

export default ChatCrumb