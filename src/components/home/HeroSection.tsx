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
import Image from "next/image"

import { motion } from "framer-motion"

const heroData = [
    {
        h2: "Pay Your Bills Effortlessly, Anytime, Anywhere",
        h3: "Discover the Ultimate Convenience in Bill Management. Experience no struggle in accessing the perfect plan for you!",
        img: "/images/hero1.png"
    },
    {
        h2: "Streamline Your Bill Payments with Ease",
        h3: "Experience Seamless Transactions and Unmatched Convenience. We are available 24/7 to attend to your demands. Experience the freedom and live in the moment",
        img: "/images/hero4.png"
    },
    {
        h2: "Simplify Your Bill Payments Today",
        h3: "Enjoy the Freedom of Managing Your Bills from Anywhere and anytime. We are available 24/7 to attend to your demands. Experience the freedom and live in the moment",
        img: "/images/hero5.png"
    },
    {
        h2: "Effortless Bill Payment at Your Fingertips",
        h3: "Access a World of Convenience for Your Financial Needs. Isubscribe is here to simplify everything for you with just a click of a button.",
        img: "/images/hero1.png"
    },
    {
        h2: "Experience Seamless Bill Management",
        h3: "Your Bills, Managed Efficiently and Effectively. Our enriching user interfaces and experience are all designed for you.",
        img: "/images/hero4.png"
    },
    {
        h2: "Revolutionize Your Bill Payment Experience.",
        h3: "Streamline Your Finances with Our Innovative Platform. Overcome that old boring way of paying and managing bill payments. Isubscribe is modern and intuitive",
        img: "/images/hero5.png"
    },
    {
        h2: "Pay Bills with Unmatched Ease",
        h3: "Take Control of Your Finances Anytime, Anywhere. We keep our customers up to date to ensure you do not miss out on anything.",
        img: "/images/hero1.png"
    },
];



const HeroSection = () => {
  return (
    <section  className=' w-full max-md:min-h-[80vh] bg-inherit max-md:px-0 relative max-w-[90rem] mx-auto '>
        <CarouselComponent />
    </section>
  )
}

export default HeroSection


export function CarouselComponent() {

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
   
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
          delay: 20000,
        }),
      ]}
     >
      <CarouselContent className={"bg-inherit"}>
        {heroData.map((d, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className={"rounded-none !bg-inherit border-none shadow-none"}>
                <CardContent className="flex max-md:flex-col-reverse max-md:gap-y-4 items-start md:items-center justify-between p-3">
                 <div className="w-full flex flex-col items-start max-md:items-center max-md:space-y-4 space-y-4 ">
                  <motion.h1
                      className="text-3xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500"
                      {...fadeIn}
                    >
                      {d.h2}
                    </motion.h1>
                    <motion.p
                      className="text-xl text-center text-muted-foreground mb-12"
                      {...fadeIn}
                    >
                      {[d?.h3]?.map((sentence, index) => (
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
                    
                 </div>
                 <div className=" w-full max-md:hidden ">
                    <Image src={d?.img} height={1000} width={1000} alt={d?.h2} className="  object-cover" />
                 </div>
                 <div className=" w-full md:hidden ">
                    <Image src={d?.img} height={1000} width={1000} alt={d?.h2} className="  object-cover" />
                 </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>

    <div className=" self-center relative flex gap-4 text-center text-sm text-default">
        {heroData?.map((_, index) => (
            <button
            key={index}
            className={`w-3 h-3  rounded-full ${
                current === index + 1
                ? "bg-violet-600 w-6 h-2  rounded-2xl "
                : "bg-violet-300"
            }`}
            ></button>
        ))}
        </div>
     </div>
  )
}
