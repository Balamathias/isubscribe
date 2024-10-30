'use client'

import React from 'react'
import DynamicSheet from '../DynamicSheet'

import { Button } from '@/components/ui/button'
import ReviewCard from './review-card'
import { useReviews } from '@/lib/react-query/funcs/ratings'

import SimpleLoader from '@/components/loaders/simple-loader'
import Empty from '../Empty'

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
  const { data: reviews, isPending, isError } = useReviews()
  return (
    <DynamicSheet
      trigger={
        <Button variant={'ghost'} className='rounded-full ring-1 text-white hover:text-violet-100 w-full border-none text-lg hover:opacity-75 transition-all border hover:bg-transparent' size={'lg'}>
          Reviews
        </Button>
      }
      sheetClassName='max-w-3xl !w-[400px] overflow-auto'
      drawerClassName='h-[75%] overflow-auto'
    >
      {
        isError && (
          <Empty 
            title='Error loading reviews'
            content="We could not load reviews at this time, please try again."
            color='red'
          />
        )
      }
      
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
    </DynamicSheet>
  )
}

export default Reviews