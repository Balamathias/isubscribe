import EducationContent from '@/components/dashboard/education/education-content'
import WidthWrapper from '@/components/WidthWrapper'
import { getUser } from '@/lib/supabase/accounts'
import EducationProvider from '@/providers/education/education-provider'


const EducationPage = async () => {
  const { data: profile } = await getUser()


  return (
    <WidthWrapper className='flex flex-col !max-w-3xl md:py-12 max-md:mt-10 mt-16'>
    <EducationProvider action='tv-cable' profile={profile!}>
      <h2 className='text-muted-foreground md:text-xl text-base tracking-tighter py-2 font-semibold'>Select Exam Type...</h2>
      <EducationContent />
    </EducationProvider>
  </WidthWrapper>
  )
}

export default EducationPage