"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
  } from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { Button } from "../ui/button"

const heroData = [
    {
        h2: "Pay Your Bills Effortlessly, Anytime, Anywhere",
        h3: "Discover the Ultimate Convenience in Bill Management",
        img: "/images/hero1.png"
    },
    {
        h2: "Streamline Your Bill Payments with Ease",
        h3: "Experience Seamless Transactions and Unmatched Convenience",
        img: "/images/hero4.png"
    },
    {
        h2: "Simplify Your Bill Payments Today",
        h3: "Enjoy the Freedom of Managing Your Bills from Anywhere",
        img: "/images/hero5.png"
    },
    {
        h2: "Effortless Bill Payment at Your Fingertips",
        h3: "Access a World of Convenience for Your Financial Needs",
        img: "/images/hero1.png"
    },
    {
        h2: "Experience Seamless Bill Management",
        h3: "Your Bills, Managed Efficiently and Effectively",
        img: "/images/hero4.png"
    },
    {
        h2: "Revolutionize Your Bill Payment Experience",
        h3: "Streamline Your Finances with Our Innovative Platform",
        img: "/images/hero5.png"
    },
    {
        h2: "Pay Bills with Unmatched Ease",
        h3: "Take Control of Your Finances Anytime, Anywhere",
        img: "/images/hero1.png"
    },
    // {
    //     h2: "Efficient Bill Payments Made Simple",
    //     h3: "Discover the Future of Financial Management",
    //     img: "/images/hero4.png"
    // },
    // {
    //     h2: "Your Go-To Solution for Bill Payments",
    //     h3: "Experience the Best in Convenience and Security",
    //     img: "/images/hero5.png"
    // },
    // {
    //     h2: "Seamlessly Manage Your Bill Payments",
    //     h3: "Elevate Your Financial Control with Our Platform",
    //     img: "/images/hero1.png"
    // },
];



const HeroSection = () => {
  return (
    <section  className=' w-full max-md:min-h-[80vh] bg-whit max-md:px-0  py- relative max-w-[90rem] mx-auto '>
        <CarouselComponent />
    </section>
  )
}

export default HeroSection


export function CarouselComponent() {
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
      <CarouselContent className={""}>
        {heroData.map((d, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className={" rounded-none  bg-whit border-none shadow-none"}>
                <CardContent className="flex max-md:flex-col-reverse max-md:gap-y-4 aspect-squar  items-start md:items-center justify-between p-3">
                 <div className=" w-full flex flex-col items-start max-md:items-center max-md:space-y-4 space-y-8 ">
                   <h1 className=" text-5xl leading-[70px] max-md:text-lg max-md:text-center font-semibold text-black">{d?.h2}</h1>
                   <h4 className=" text-2xl  max-md:text-center  text-gray-800">{d?.h3}</h4>
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

    <div className=" self-center relative flex gap-4 text-center text-sm text-black">
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
