import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import HomePage from "@/components/home/HomePage";
import { redirect } from "next/navigation";

export default async function Home({searchParams}: { searchParams: {[key: string]: string }}) {
  
  const sP = new URLSearchParams(searchParams)

  const errorCode = sP.get('error_code')
  const errorMessage = sP.get('error_description')

  if (errorCode === '403') {
    return redirect('/auth/auth-code-error?msg=' + encodeURIComponent(errorMessage!))
  }

  return(
    <div className=" flex flex-col bg-violet-50 min-h-screen">
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}
