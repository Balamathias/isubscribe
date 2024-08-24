import { CalendarIcon } from "@radix-ui/react-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { LucideTrash } from "lucide-react"
import { useDeleteChat } from "@/lib/react-query/funcs/chats"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { QueryKeys } from "@/lib/react-query/query-keys"
import { useSearchParams } from "next/navigation"

interface ChatActionsProps {
  children?: React.ReactNode,
  canDelete?: boolean,
  chatId: string
}

export default function ChatActions({children, chatId, canDelete=false}: ChatActionsProps) {
  const { mutate: deleteChat, isPending } = useDeleteChat()
  const queryClient = useQueryClient()
  const roomId = useSearchParams().get('chat_room_id')

  if (!canDelete) return <>{children}</>
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="hover:opacity-80 hover:transition-all hover:cursor-pointer">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit p-4 border-none bg-transparent shadow-none drop-shadow-none">
        <div className="flex justify-between space-y-2.5 flex-col">
          <Button variant={'ghost'} className="bg-red-600 text-red-100 hover:bg-red-700 hover:transition-all" onClick={() => deleteChat(chatId, {
            onSuccess: () => {
              toast.success('Chat deleted successfully')
              queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, roomId]})
              queryClient.invalidateQueries({queryKey: [QueryKeys.get_user_chats, chatId]})
            },
            onError: (error) => {
              toast.error(error.message)
            }
          })}>
            <LucideTrash size={20} />
            <span className="ml-2">{isPending ? 'Deleting' : 'Delete'}</span>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
