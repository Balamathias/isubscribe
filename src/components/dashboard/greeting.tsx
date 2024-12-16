import { getUser } from "@/lib/supabase/accounts";
import { getGreeting } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton'

export default async function Greeting() {
  const { data: profile } = await getUser()
  return (
    <div className='flex flex-col space-y-1 md:hidden'>
      <h2 className='text-muted-foreground text-lg'>{getGreeting()}, <span className="font-semibold dark:text-amber-500/90">{profile?.full_name?.split(' ')?.at(0) || 'Guest'}</span>.</h2>
      <p className='text-muted-foreground text-xs md:text-base'>What would you like to subscribe today?</p>
    </div>
  )
}


export const GreetingSkeleton = () => {
  return (
    <div className='flex flex-col space-y-1 md:hidden'>
      <Skeleton className='h-6 w-48 rounded-md' />
      <Skeleton className='h-4 w-64 rounded-md' />
    </div>
  )
}
