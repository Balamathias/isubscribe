'use client'

import React from 'react'
import DynamicSheet from '../DynamicSheet'

import { Button } from '@/components/ui/button'
import ReviewCard from './review-card'
import { useReviews } from '@/lib/react-query/funcs/ratings'

import SimpleLoader from '@/components/loaders/simple-loader'
import Empty from '../Empty'

const Reviews = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { data: reviews, isPending, isError } = useReviews(20)
  return (
    <DynamicSheet
      trigger={trigger || <></>}
      sheetClassName='rounded-none overflow-auto'
      drawerClassName=''
      title="Reviews"
    >
      {
        isError ? (
          <Empty 
            title='Error loading reviews'
            content="We could not load reviews at this time, please try again."
            color='red'
            className='bg-transparent'
          />
        )
      :
      
      (
        isPending ? (
          <SimpleLoader />
        ) : (
          <div className='flex flex-col gap-4 h-full overflow-auto max-md:h-[60vh]'>
            <div className="grid grid-cols-1 gap-4 md:gap-5">
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
          </div>)
        )
      }
    </DynamicSheet>
  )
}

export default Reviews