"use client";

import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ReviewProps {
  avatar: string;
  full_name: string;
  comment: string;
  rating: number;
}

const ReviewCard: React.FC<ReviewProps> = ({ avatar, full_name, comment, rating }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
  };

  const starVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-inherit p-3.5 md:p-5 border-b flex flex-row items-start gap-4 w-full max-w-xl mx-auto"
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src={avatar} />
        <AvatarFallback>
          {full_name?.at?.(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{full_name}</h3>
        </div>

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{comment}</p>

        <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <motion.span key={i} variants={starVariants} initial="initial" animate="animate">
                <StarIcon
                  className={`text-base ${
                    i < rating ? "text-amber-400" : "text-gray-400 dark:text-gray-600"
                  }`}
                />
              </motion.span>
            ))}
          </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
