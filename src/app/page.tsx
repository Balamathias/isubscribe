import HomePage from "@/components/home/HomePage";
import { redirect } from "next/navigation";

export default async function Home({searchParams}: { searchParams: {[key: string]: string }}) {
  
  const params = new URLSearchParams(searchParams)

  const errorCode = params.get('error_code')
  const errorMessage = params.get('error_description')

  if (errorCode === '403') {
    return redirect('/auth/auth-code-error?msg=' + encodeURIComponent(errorMessage!))
  }

  return(
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 flex flex-col gap-y-6 justify-between">
      <HomePage />
    </div>
  )
}
