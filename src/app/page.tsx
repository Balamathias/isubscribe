import HomePage from "@/components/home/HomePage";
import { redirect } from "next/navigation";

export default async function Home({searchParams}: { searchParams: {[key: string]: string }}) {
  
  const params = new URLSearchParams(searchParams)

  const errorCode = params.get('error_code')
  const errorMessage = params.get('error_description')

  if (errorCode === '403') {
    return redirect('/auth/auth-code-error?msg=' + encodeURIComponent(errorMessage!))
  }

  return redirect('/dashboard')

  return(
    <div className="min-h-screen">
      <HomePage />
    </div>
  )
}
