'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type StarRatingProps = {
  maxStars?: number;
  onRate: (rating: number) => void
};

const StarRating: React.FC<StarRatingProps> = ({ maxStars = 5, onRate }) => {
  const [rating, setRating] = useState<number>(0);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  useEffect(() => {onRate(rating)}, [rating])

  return (
    <div className="flex space-x-2">
      {[...Array(maxStars)].map((_, index) => (
        <motion.div
          key={index}
          className="cursor-pointer"
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.9, rotate: 5 }}
          onClick={() => handleStarClick(index)}
        >
          <Star filled={index < rating} />
        </motion.div>
      ))}
    </div>
  );
};

const Star: React.FC<{ filled: boolean }> = ({ filled }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`w-8 h-8 text-amber-500 transition-colors duration-300 ease-in-out ${
        filled ? 'text-amber-500' : 'text-gray-400'
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.92c.969 0 1.371 1.24.588 1.81l-3.984 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.984-2.89a1 1 0 00-1.176 0l-3.984 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.97 10.1c-.783-.57-.38-1.81.588-1.81h4.92a1 1 0 00.95-.69l1.518-4.674z"
      />
    </svg>
  );
};

export default StarRating;
