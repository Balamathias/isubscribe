"use client"

import Image from 'next/image'
import React, { act, useState } from 'react'
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
import Autoscroll from "embla-carousel-autoplay"
import { Button } from '../ui/button'
import { Calendar, MapPin, Quote, Star } from 'lucide-react'
import AuthSeparator from '../auth/AuthSeparator'


const cardsData = [
    {
      heading:"Africa, Amazing Africa Safari",
      location:"Nigeria Lagos Africa",
      icon:<MapPin />,
      img:"/users/user-1.png",
      noActivity:"10 Activites",
      noPlaces:"10 Places",
      noWeeks:"2 Weeks",
      price:"₦30,000",
      reviews:"4.9",
      company:"Huoispay Ltd",
      name:"Dafe Stanley",
      comment:"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis"
    },
    {
      heading:"Africa, Amazing Africa Safari",
      location:"Nigeria Abuja Africa",
      icon:<MapPin />,
      img:"/users/user-2.png",
      noActivity:"10 Activites",
      noPlaces:"10 Places",
      noWeeks:"2 Weeks",
      price:"₦30,000",
      reviews:"4.9",
      company:"Huoispay Ltd",
      name:"Dafe Stanley",
      comment:"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis"
    },
    {
      heading:"Africa, Amazing Africa Safari",
      location:"Nigeria Kano Africa",
      icon:<MapPin />,
      img:"/users/user-3.png",
      noActivity:"10 Activites",
      noPlaces:"10 Places",
      noWeeks:"2 Weeks",
      price:"₦30,000",
      reviews:"4.9",
      company:"Huoispay Ltd",
      name:"Dafe Stanley",
      comment:"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis"
    },
    {
      heading:"Africa, Amazing Africa Safari",
      location:"Nigeria Ekiti Africa",
      icon:<MapPin />,
      img:"/users/user-1.png",
      noActivity:"10 Activites",
      noPlaces:"10 Places",
      noWeeks:"2 Weeks",
      price:"₦30,000",
      reviews:"4.9",
      company:"Huoispay Ltd",
      name:"Dafe Stanley",
      comment:"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis"
    },
    {
      heading:"Africa, Amazing Africa Safari",
      location:"Nigeria Ebonyi Africa",
      icon:<MapPin />,
      img:"/users/user-2.png",
      noActivity:"10 Activites",
      noPlaces:"10 Places",
      noWeeks:"2 Weeks",
      price:"₦30,000",
      reviews:"4.9",
      company:"Huoispay Ltd",
      name:"Dafe Stanley",
      comment:"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliquaquis"
    },
  ]

  const TestimonialsSection = () => {
    return (
      <section  className=' w-full  max-md:px-4 px-20 py-6 relative overflow-hidden max-w-[90rem] mx-auto  '>
      
        <div className=' flex flex-col items-center max-md:space-y-4 space-y-7 max-md:mt-4 py-6'>
          <h1 className=" text-4xl max-md:text-lg font-semibold text-black ">Reviews & Testimonials</h1>
          {/* <AuthSeparator separatorText="Reviews & Testimonials" seperatorWrapperClassName=" text-4xl max-md:text-lg font-semibold text-black" /> */}
          {/* <h2 className=" text-5xl max-md:text-3xl font-semibold text-black text-center">What Our Customers Are <br />
          Saying About Us</h2> */}
          <div className={" "}>
            <CarousalComponent />
          </div>
        </div>
          
      </section>
    )
  }
  
  export default TestimonialsSection




  export function CarousalComponent() {
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
    <div className=" flex flex-col space-y-6">
    <Carousel 
      opts={{
        align: "start",
        loop:true
      }}
      className="max-sm:max-w-sm max-md:max-w-md"
     setApi={setApi} 
     plugins={[
         Autoplay({
          delay: 7000,
        }),
        // Autoscroll({
        //   delay:2000,
        // })
      ]}
     >
      <CarouselContent className={"flex gap- w-[96vw] max-md:w-[100vw]"}>
             {cardsData?.map((d, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 bg-red-30 p- px-6 md:px-6">
                    <Card className={" flex group items-start flex-col border-non bg-white mt-  shadow-none  py-4 gap-4 px-2 hover:bg-gradient-to-t hover:from-teal-50 hover:to-violet-100  hover:transition-all rounded-md overflow-hidde relative border-dashed dark:border-muted border-[3px] rounded-tl-[3rem] rounded-br-[3rem] min-h-[300px] "}>
                      {/* <Image src={d?.img} height={100} width={100} alt={d?.heading} className=' rounded-full bg-emerald-50 p-2 group-hover:fade-out-20' /> */}

                      <div className=' flex flex-col px-4  space-y-2 pb-4 max-md:space-y-1 w-full '>
                        <h2 className=' text-gray-600 text-lg p-'>{d?.comment}</h2>
                        {/* <h1 className=' text-2xl max-md:text-lg font-semibold text-slate-800 p-'>{d?.name}</h1> 
                        <h1 className=' text-lg max-md:text-lg text-gray-700'>{d?.company}</h1>  */}

                      <div className="flex items-center">
                      <Image
                        height={1000}
                        width={1000}
                        className="w-16 h-16 rounded-full mr-4 object-cover bg-emerald-50 p-2"
                        src={d.img}
                        alt={d.name}
                      />
                      <div>
                        <p className="text-lg font-[500]">{d.name}</p>
                      </div>
                    </div>
                       
                      </div>
                      <span className=' absolute bottom-11 right-2 bg-gray-400 rounded-full text-white p-3'><Quote size={20} /> </span>
                    </Card>
                </CarouselItem>
             ))}
      </CarouselContent>
    </Carousel>

      <div className=" self-center relative flex gap-4 text-center text-sm text-black">
        {cardsData?.map((_, index) => (
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