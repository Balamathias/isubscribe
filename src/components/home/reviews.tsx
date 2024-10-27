'use client'

import React from 'react'
import DynamicModal from '../DynamicModal'

import { Button } from '@/components/ui/button'
import ReviewCard from './review-card'
import { useReviews } from '@/lib/react-query/funcs/ratings'

import SimpleLoader from '@/components/loaders/simple-loader'

const reviews = [
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    full_name: "John Doe",
    comment: "Amazing service! I would highly recommend it to anyone.",
    rating: 5,
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    full_name: "Jane Smith",
    comment: "It was good, but I feel there’s room for improvement.",
    rating: 4,
  },
];

const Reviews = () => {
  const { data: reviews, isPending } = useReviews()
  return (
    <DynamicModal
      trigger={
        <Button variant={'ghost'} className='rounded-full ring-1 text-white hover:text-violet-100 w-full border-none text-lg hover:opacity-75 transition-all border hover:bg-transparent' size={'lg'}>
          See what people are saying.
        </Button>
      }
      dialogClassName='max-w-3xl w-full'
    >
      {
        isPending ? (
          <SimpleLoader />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-5 overflow-auto">
            {reviews?.data?.map((review, index) => (
              <ReviewCard
                key={index}
                avatar={review?.profile?.avatar || ''}
                full_name={review?.profile?.full_name || ''}
                comment={review?.comment || ''}
                rating={review?.rating ?? 0}
              />
            ))}
          </div>
        )
      }
    </DynamicModal>
  )
}

export default Reviews