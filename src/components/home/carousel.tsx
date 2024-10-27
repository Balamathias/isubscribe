"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
  } from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import NavHeader from "./nav-header"
import { Button } from "../ui/button"
import Link from "next/link"
import Footer from "./footer-transparent"
import Loader from "../loaders/loader"
import { useGetProfile } from "@/lib/react-query/funcs/user"


const heroData = [
  {
      title: "Pay Your Bills Effortlessly, Anytime, Anywhere",
      description: "Discover the Ultimate Convenience in Bill Management. Experience no struggle in accessing the perfect plan for you! Our plans are so much affordable. Spend less, enjoy more!",
      img: "/images/slides/girl-making-call.jpg",
    },
    {
      title: "Streamline Your Bill Payments with Ease",
      description: "Experience Seamless Transactions and Unmatched Convenience. We are available 24/7 to attend to your demands. Experience the freedom and live in the moment",
      img: "/images/slides/first-slide.jpg",
    },
    {
      title: "Experience seamless transaction with zero charges.",
      description: "Ever experienced bottle necks with transaction fees? We do not charge a dime for transfers. We in fact offer you a data bonus for every successful transaction you make to keep you up to date.",
      img: "/images/slides/girl-with-phone.jpg",
  },
  
];

export default function CarouselComponent() {

  const { data: user, isPending } = useGetProfile()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

    const [api, setApi] = React.useState<CarouselApi>()
    const [count, setCount] = React.useState(0)
    const [current, setCurrent] = React.useState(0)
   
    React.useEffect(() => {
      if (!api) {
        return
      }
   
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
   
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
      })
    }, [api])

  if (isPending) {
    return (
      <Loader />
    )
  }

  return (
    <div className=" flex flex-col">
    <Carousel 
     className="w-full  "
     setApi={setApi} 
     opts={{
      align: "start",
      loop:true
    }}
     plugins={[
         Autoplay({
          delay: 5000,
        }),
      ]}
     >
      <CarouselContent className={"bg-inherit p-0 inset-0 min-h-screen"}>
        {heroData.map((data, index) => (
          <CarouselItem key={index}>
            <div className={cn("flex flex-col flex-1 inset-0 h-full w-full max-sm:bg-right bg-cover bg-no-repeat bg-blend-normal aspect-video p-0", 
              )}
              style={{ backgroundImage: `url("${data.img}")`}}
            >
              <Card className={cn("flex items-center justify-between border-none flex-col shadow-none bg-inherit inset-0 h-full w-full p-4",
                `bg-gradient-to-r from-violet-950/90 to-violet-700/20 rounded-none`
              )}
                >
                <NavHeader user={user?.data!} />

                <CardContent className="flex flex-col my-16 md:mt-28 max-w-7xl mx-auto">
                 <div className="w-full flex flex-col gap-y-4 md:gap-y-7 h-full md:max-w-[50%]">
                  <motion.h1
                      className="text-3xl md:text-5xl font-semibold text-violet-50"
                      {...fadeIn}
                    >
                      {data?.title}
                    </motion.h1>
                    <motion.p
                      className="text-base md:text-xl text-violet-100 mb-12"
                      {...fadeIn}
                    >
                      {[data.description]?.map((sentence, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 2, delay: index * 2 }}
                        >
                          {sentence.split('').map((char, charIndex) => (
                            <motion.span
                              key={charIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.1, delay: charIndex * 0.05 + index * 2 }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </motion.span>
                      ))}
                    </motion.p>

                    {
                      user?.data ? (
                        <Button variant={'ghost'} asChild className='rounded-full w-full border-none bg-white text-black text-lg hover:opacity-75 transition-all' size={'lg'}>
                          <Link href={"/dashboard"}>Go to Dashboard</Link>
                        </Button>
                      ): (
                        <Button variant={'ghost'} asChild className='rounded-full w-full border-none bg-white text-black text-lg hover:opacity-75 transition-all' size={'lg'}>
                          <Link href={"/sign-in"}>Get started.</Link>
                        </Button>
                      )
                    }
                 </div>
                </CardContent>

                <div className="">
                  <Footer />
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
     </div>
  )
}