import SplashScreen from "@/components/SplashScreen";
import SignOutComponent from "@/components/auth/SignOutComponent";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import HomePage from "@/components/home/HomePage";
import { getUser } from "@/lib/supabase/accounts";
import { getCurrentUser } from "@/lib/supabase/user.actions";
import { redirect } from "next/navigation";

export default async function Home({searchParams}: { searchParams: {[key: string]: string }}) {
  
  const user = await getUser()
  const sP = new URLSearchParams(searchParams)

  const error = sP.get('error')
  const errorCode = sP.get('error_code')
  const errorMessage = sP.get('error_description')

  if (errorCode === '403') {
    return redirect('/auth/auth-code-error?msg=' + encodeURIComponent(errorMessage!))
  }

  // if (user) {
  //   if (!user?.data?.onboarded) return redirect('/auth/pass-pin')
  //   return redirect('/dashboard')
  // }

  return(
    <div className=" flex flex-col bg-violet-50 min-h-screen">
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}
