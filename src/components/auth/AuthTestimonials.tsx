"use client";

import { LucideLoader2, Quote } from "lucide-react";
import React, { useState, useEffect } from "react";
import AuthSeparator from "./AuthSeparator";
import Link from "next/link";
import { Button } from "../ui/button";
import { useReviews } from "@/lib/react-query/funcs/ratings";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const AuthTestimonial = ({sheetOpen}:{sheetOpen?: boolean}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { data: testimonials, isPending } = useReviews()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % (testimonials?.data?.length || 0));
    }, 9000); // Change testimonial every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleIndicatorClick = (index:number) => {
    setCurrentTestimonial(index);
  };

  if (isPending) {
    return (<LucideLoader2 className="animate-spin") />
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
          <div className="overflow-auto relative self-center w-full shadow-none p-6 min-h-[300px] border-dashed dark:border-muted border-[2px] rounded-tl-[3rem] rounded-br-[3rem]">
            {testimonials?.data?.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity w-full duration-500 ease-in-out ${
                  currentTestimonial === index ? "opacity-100" : "opacity-0"
                } ${currentTestimonial === index ? "block" : "hidden"}`}
              >
                <AuthSeparator separatorText="Testimonials" seperatorWrapperClassName="" />
                   
                <p className="text-lg mb-4">{testimonial.comment}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial?.profile?.avatar ?? ''} />
                    <AvatarFallback>{testimonial?.profile?.full_name?.at(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-[500]">{testimonial?.profile?.full_name}</p>
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
