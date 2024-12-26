"use client";

import { LucideLoader2, Quote, StarIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import AuthSeparator from "./AuthSeparator";
import Link from "next/link";
import { Button } from "../ui/button";
import { useReviews } from "@/lib/react-query/funcs/ratings";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const AuthTestimonial = ({sheetOpen}:{sheetOpen?: boolean}) => {
  const { data: testimonials, isPending } = useReviews(7)
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (!testimonials?.data?.length) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.data.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const handleIndicatorClick = (index:number) => {
    setCurrentTestimonial(index);
  };

  if (isPending) {
    return (<LucideLoader2 className="animate-spin" />)
  }

  return (
    <div className="flex flex-col relative max-w-[700px] items-center mx-auto w-full justify-center h-screen overflow-hidden">
          <Button asChild variant={'secondary'} className='rounded-full absolute top-2 right-3 dark:bg-secondary bg-white ring-1 font-semibold border-none' size={'lg'}>
              <Link 
                href={'/about'} 
                className={``}
              >About us</Link>
          </Button>
      <div className="max-md:flex max-md:gap-5 max-md:flex-col-reverse self-center items-center gap-4 w-full">
        {/*  Testimonial Content */}
        <div className={`flex flex-col justify-center w-full gap-4 items-center ${sheetOpen ? " p-1" : "p-10"}`}>
          <div className="overflow-hidden relative self-center w-full p-6 min-h-[300px] 
            backdrop-blur-md bg-white/10 dark:bg-black/10 
            border border-white/20 dark:border-gray-800/20
            rounded-tl-[3rem] rounded-br-[3rem] 
            shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
            {testimonials?.data?.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all transform duration-700 ease-in-out absolute w-full
                  ${currentTestimonial === index 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 translate-x-full"
                  }`}
                style={{
                  transform: `translateX(${(index - currentTestimonial) * 100}%)`,
                }}
              >
                <AuthSeparator separatorText="Testimonials" seperatorWrapperClassName="" />
                   
                <p className="text-lg mb-4 leading-relaxed line-clamp-4 break-words max-w-full overflow-hidden mr-4">
                  {testimonial.comment}
                </p>
                <div className="flex items-start gap-x-2">
                  <Avatar className="h-12 w-12 ring-1 border">
                    <AvatarImage src={testimonial?.profile?.avatar ?? ''} />
                    <AvatarFallback>{testimonial?.profile?.full_name?.at(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className=" space-y-2">
                    <p className="text-xl font-[500]">{testimonial?.profile?.full_name}</p>
                    <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                          <div key={i}>
                            <StarIcon
                              className={`text-base ${
                                i < (testimonial.rating || 0) ? "text-amber-400" : "text-gray-400 dark:text-gray-600"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                  </div>
                </div>
              </div>
            ))}
            <Quote className=" text-3xl absolute bottom-4 right-4 text-white mb-3 bg-violet-600 p-2 h-9 w-9 rounded-full" />
          </div>
          <div className="flex mt-4 gap-4">
            {testimonials?.data?.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                className={`w-4 h-4 rounded-full ${
                  currentTestimonial === index
                    ? "bg-violet-600"
                    : "bg-violet-300"
                }`}
              ></button>
            ))}
          </div>
          {/* <AuthSeparator separatorText="Bills Payments Just Got Better..." /> */}
        </div>
      </div>
    </div>
  );
};

export default AuthTestimonial;
