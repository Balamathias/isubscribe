"use client"

import Image from 'next/image'
import React from 'react'
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import { MapPin, Quote, Star } from 'lucide-react'


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
      comment:"I had discovered over time that it had become quite expensive to train MTN data as was my case recently, but not until I discovered isubscribe. It has helped me in my daily data purchases by simplifying it all for me."
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
      comment:"As for me, I would say that isubscribe has gotten a user for life! It is now my go-to platform for every of my data purchases."
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
      comment:"I had discovered over time that it had become quite expensive to train MTN data as was my case recently, but not until I discovered isubscribe"
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
      comment:"As for me, I would say that isubscribe has gotten a user for life! It is now my go-to platform for every of my data purchases."
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
      comment:"As for me, I would say that isubscribe has gotten a user for life! It is now my go-to platform for every of my data purchases."
    },
  ]

  const TestimonialsSection = () => {
    return (
      <section  className=' w-full  max-md:px-4 px-20 py-12 relative overflow-hidden max-w-[90rem] mx-auto  '>
      
        <div className=' flex flex-col items-center max-md:space-y-4 space-y-7 max-md:mt-4 py-6'>
          <h1 className=" text-4xl max-md:text-lg font-semibold ">Reviews & Testimonials</h1>
          <div className={""}>
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
      ]}
     > 
      <CarouselContent className={"flex max-md:w-[100vw]"}>
             {cardsData?.map((d, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-6 md:px-6">
                    <Card className={`${current + 1  === index + 1  && ""} !bg-inherit backdrop-blur-md border-1 flex group items-start flex-col mt-1 shadow-none  py-4 gap-4 px-2 hover:transition-all rounded-2xl overflow-hidden relative dark:border-muted border h-auto`}>

                      <div className=' flex flex-col px-4  space-y-2 pb-4 max-md:space-y-1 w-full '>
                        <h2 className=' text-muted-foreground text-lg py-1'>{d?.comment}</h2>
                      <div className="flex items-center">
                      <Image
                        height={1000}
                        width={1000}
                        className="w-16 h-16 rounded-full mr-4 object-cover bg-emerald-50 dark:bg-inherit p-2"
                        src={d.img}
                        alt={d.name}
                      />
                      <div>
                        <p className="text-lg font-medium">{d.name}</p>
                      </div>
                    </div>
                       
                      </div>
                      <span className=' absolute bottom-11 right-2 bg-gray-600/20 text-gray-600 rounded-full p-3'>
                        <Quote size={20} /> 
                      </span>
                    </Card>
                </CarouselItem>
             ))}
      </CarouselContent>
    </Carousel>

      <div className=" self-center relative flex gap-4 text-center text-sm">
        {cardsData?.map((_, index) => (
            <button
            key={index}
            className={`w-3 h-3  rounded-full ${
                current === index + 1
                ? "bg-primary w-6 h-2  rounded-2xl "
                : "bg-violet-300 dark:bg-secondary"
            }`}
            ></button>
        ))}
        </div>
     </div>
  )
}