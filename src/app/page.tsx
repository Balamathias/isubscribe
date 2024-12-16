// 'use client'

// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import SplashScreen from "@/components/splash-screen"

import HomePage from '@/components/home/HomePage'

export default function Home({searchParams}: { searchParams: {[key: string]: string }}) {
  // const router = useRouter()
  
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams)
  //   const errorCode = params.get('error_code')
  //   const errorMessage = params.get('error_description')

  //   if (errorCode === '403') {
  //     router.push('/auth/auth-code-error?msg=' + encodeURIComponent(errorMessage!))
  //     return
  //   }

  //   const timeoutId = setTimeout(() => {
  //     router.push('/dashboard')
  //   }, 1500)

  //   return () => clearTimeout(timeoutId)
  // }, [searchParams, router])

  // return <SplashScreen />

  // const acct = await createVirtualAccount({
  //   customerCode: 'CUS_8hce0g9mj3foj0g',
  //   preferredBank: 'titan-paystack',
  //   first_name: 'Mathias',
  //   last_name: 'Bala',
  //   phone: '08123456789',
  // })

  // console.log(acct)

  return <HomePage />
}
