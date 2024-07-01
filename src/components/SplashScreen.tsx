"use client"
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Logo from "./Logo";

declare interface SplashScreenProps {
  splashScreen?: boolean,
  textContent?: string
}

export default function SplashScreen({splashScreen=true, textContent}: SplashScreenProps) {

  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col bg-purple-500/10 dark:bg-black/50 z-20 items-center justify-center">
      <Loader2 size={34} className='animate-spin absolute left-4 top-4 text-primary' />
      <div className=" p-4 flex flex-col gap-2 items-center justify-center rounded-md w-full">
        {/* <Image 
            src={'/logo/rounded.png'}
            width={300}
            height={300}
            quality={100}
            className="md:h-10 md:w-10 h-8 w-8"
            alt="Isubscribe Logo"
        /> */}
        <div className="flex flex-col justify-center items-center">
          <Logo className="w-fit block"/>
          {textContent && <p className="text-lg text-center font-semibold">{textContent}</p>}
        </div>
      </div>
    </div>
  );
}
