import { getCurrentUser } from '@/lib/supabase/user.actions'
import CarouselComponent from './carousel'

const HeroSection = async () => {
  const { data: { user } } = await getCurrentUser()
  return (
    <div className='inset-0'>
      <CarouselComponent user={user} />
    </div>
  )
}

export default HeroSection