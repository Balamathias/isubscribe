'use client'

import React, { ReactNode, useState } from 'react'
import DynamicModal from '../DynamicModal'
import { Button } from '../ui/button'
import { signOut } from '@/lib/supabase/user.actions'
import { toast } from 'sonner'
import LoadingOverlay from '../loaders/LoadingOverlay'
import { Tables } from '@/types/database'
import { LucideArrowRight } from 'lucide-react'

const SignOutComponent = ({ profile, trigger }: { profile: Tables<'profile'>, trigger?: ReactNode }) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        setOpen(false)
        try {
            setLoading(true)
            await signOut()
        } catch (error: any) {
            toast.error(error.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='flex flex-col py-2 gap-y-2'>
      <DynamicModal
        trigger={
            trigger ? trigger : <Button className='w-full flex flex-row gap-x-1 items-center rounded-xl' variant={'destructive'}>
              <span>Log out</span>
              <LucideArrowRight size={18} />
            </Button>
        }
        open={open}
        setOpen={setOpen}
      >
        <div className='flex flex-col gap-y-4 py-2'>
          <h1 className='text-xl font-semibold'>Logout?</h1>
          <p className='text-sm'>Hi <span className='text-primary/90 font-semibold'>{profile?.full_name}</span>, Are you sure you want to logout?</p>
          <div className='flex flex-row gap-x-2 float-right justify-end md:-mb-4'>
            <Button variant={'destructive'} onClick={handleSignOut}>Yes I do</Button>
            <Button variant={'secondary'} onClick={() => setOpen(false)}>No I {"don't"}</Button>
          </div>
        </div>
      </DynamicModal>

      {
        loading && <LoadingOverlay />
      }
    </div>
  )
}

export default SignOutComponent
