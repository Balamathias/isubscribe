'use client'

import { useRouter } from "next/navigation"
import Loader from '@/components/loaders/loader'
import { useEffect } from "react"

export default function Home({searchParams}: { searchParams: {[key: string]: string }}) {
  const router = useRouter()
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    const errorCode = params.get('error_code')
    const errorMessage = params.get('error_description')

    if (errorCode === '403') {
      router.push('/auth/auth-code-error?msg=' + encodeURIComponent(errorMessage!))
      return
    }

    const timeoutId = setTimeout(() => {
      router.push('/dashboard')
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [searchParams, router])

  return <Loader />
}
