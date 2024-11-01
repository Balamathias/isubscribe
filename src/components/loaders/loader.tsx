"use client";

import { motion } from "framer-motion";
import React from "react";

const letters = Array.from("iSubscribe");

const container = {
  hidden: { opacity: 0 },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05 * i,
    },
  }),
};

const bounce = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -5, 5, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse" as "reverse" | "loop" | "mirror",
    },
  },
};

const Loader = () => {

  return (
    <motion.div
      className="flex justify-center items-center h-screen dark:bg-gray-900 bg-gray-900 w-full fixed top-0 left-0 z-50"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="max-sm:max-w-[90vw]">y
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="md:text-5xl text-3xl font-semibold text-primary px-4"
            variants={bounce}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default Loader;
