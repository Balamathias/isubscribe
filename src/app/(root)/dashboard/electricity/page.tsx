
import ElectricityContent from '@/components/dashboard/electricity/electricity-content'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import ElectricityProvider from '@/providers/electricity/electricity-provider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Electricity | isubscribe',
  description: 'Pay for your cable TV subscription with ease. Get started today with isubscribe!',
}

export const runtime = 'edge'

const ElectricityCablePage = async () => {
  const { data: profile } = await getUser()

  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 max-md:mt-10 mt-16 max-sm:px-1.5'>
    <ElectricityProvider action='tv-cable' profile={profile!}>
      <h2 className='text-muted-foreground md:text-2xl text-lg py-2 font-semibold'>Select Provider</h2>
      <ElectricityContent />
    </ElectricityProvider>
  </WidthWrapper>
  )
}

export default ElectricityCablePage