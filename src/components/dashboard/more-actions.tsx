import { Star, UserPlus } from 'lucide-react'

import ActionItem from './settings/setting-item'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { Skeleton } from '../ui/skeleton'
import Reviews from '../home/reviews'
import Link from 'next/link'

const MoreActions = async () => {
  const { data: { user } } = await getCurrentUser()
  return (
    <div className='flex flex-col gap-y-3.5'>
        {
            !user && (
                <Link href='/sign-up'>
                    <ActionItem 
                        icon={<UserPlus />}
                        title='Create account'
                        description='Create an account to start using iSubscribe'
                        iconClassName='bg-violet-600/15 text-violet-600'
                        indicator={
                            <span className=' bg-violet-600 w-3 h-3 rounded-full animate-pulse' />
                        }
                    />
                </Link>
            )
        }
        
        <Reviews 
            trigger={
                <ActionItem 
                    icon={<Star />}
                    title='Reviews'
                    description='See what people are saying about iSubscribe'
                    iconClassName='bg-amber-600/15 text-amber-600'
                />
            }
        />
    </div>
  )
}

export const MoreActionsSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-3.5'>
        <Skeleton className='w-full h-10' />
        <Skeleton className='w-full h-10' />
    </div>
  )
}

export default MoreActions

