
import ElectricityContent from '@/components/dashboard/electricity/electricity-content'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import ElectricityProvider from '@/providers/electricity/electricity-provider'


const ElectricityCablePage = async () => {
  const { data: profile } = await getUser()


  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 max-md:mt-10 mt-16'>
    <ElectricityProvider action='tv-cable' profile={profile!}>
      <h2 className='text-gray-800 text-lg py-2'>Select Provider...</h2>
      <ElectricityContent />
    </ElectricityProvider>
  </WidthWrapper>
  )
}

export default ElectricityCablePage