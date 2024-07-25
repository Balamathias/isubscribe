
import TVContent from '@/components/dashboard/tv-cable/tv-content'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import TvCableProvider, { useTvCable } from '@/providers/tv-cable/tv-cable-provider'


const TvCablePage = async () => {
  const { data: profile } = await getUser()


  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 max-md:mt-10 mt-16'>
    <TvCableProvider action='tv-cable' profile={profile!}>
      <h2 className='text-muted-foreground md:text-lg text-base tracking-tight py-2'>Select Cable Provider...</h2>
      <TVContent />
    </TvCableProvider>
  </WidthWrapper>
  )
}

export default TvCablePage