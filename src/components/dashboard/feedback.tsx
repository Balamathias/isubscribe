'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import DynamicModal from '../DynamicModal'
import StarRating from './star-rating'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { setUserRating } from '@/lib/supabase/user.actions'
import { toast } from 'sonner'
import { LucideCheck, LucideThumbsUp } from 'lucide-react'

const Feedback = ({ trigger }: { trigger: React.ReactNode }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('stale')
  const [open, setOpen] = useState(false)

  const handleRating = async () => {
    if (!rating) {
      return toast.info('You have not rated us yet!')
    }

    if (!comment) {
      return toast.info('Please post a comment to continue.')
    }

    setStatus('pending')

    const response = await setUserRating(rating, comment)

    if (response?.data) {
      setStatus('success')
      setComment('')
      toast.success('Feedback posted successfully.')
    } else {
      toast.error('We could not post your comment at this time, please try again.')
      setStatus('failed')
    }
  }

  return (
    <DynamicModal trigger={trigger} open={open} setOpen={setOpen}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="sm:p-6"
      >
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className='flex flex-col gap-y-3 justify-center items-center text-center'
          >
            <div className='w-12 h-12 flex items-center justify-center rounded-full bg-amber-600/20 text-amber-600'>
              <LucideCheck />
            </div>
            <p className='text-muted-foreground text-base'>
              Thank you for your feedback, we shall keep working to make isubscribe better for you!
            </p>
            <Button
              className='rounded-full w-full'
              size={'lg'}
              variant={'secondary'}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className='flex flex-col gap-y-4 items-center justify-center'
          >
            <div className="flex items-center justify-center flex-col gap-x-3">
              <div className='w-10 h-10 flex items-center justify-center rounded-full bg-amber-600/20 text-amber-600'>
                <LucideThumbsUp size={15} />
              </div>
              <h2 className='animate-pulse text-xl font-semibold py-2'>Rate us</h2>
            </div>
            <StarRating onRate={(count) => setRating(count)} />
            <Textarea
              placeholder="Post a comment..."
              className='ring-1 shadow-none rounded-2xl border-none'
              onChange={e => setComment(e.target.value)}
              value={comment}
            />
            <Button
              disabled={status === 'pending'}
              size={'lg'}
              className='rounded-full w-full'
              onClick={handleRating}
            >
              {status === 'pending' ? 'Posting...' : 'Submit'}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </DynamicModal>
  )
}

export default Feedback
