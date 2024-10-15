'use client'

import React, { ReactNode, useState } from 'react'
import DynamicModal from '../DynamicModal'
import { Button } from '../ui/button'
import { signOut } from '@/lib/supabase/user.actions'
import { toast } from 'sonner'
import LoadingOverlay from '../loaders/LoadingOverlay'
import { Tables } from '@/types/database'
import { LogOut, LucideArrowRight } from 'lucide-react'

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
            trigger ? trigger : <Button className='w-full flex flex-row gap-x-1 items-center rounded-full text-xs md:text-sm' variant={'destructive'}>
              <span>Sign out</span>
              <LucideArrowRight size={18} />
            </Button>
        }
        open={open}
        setOpen={setOpen}
        dialogOnly
        drawerClassName='rounded-[2rem]'
        dialogClassName='rounded-[2rem]'
      >
        <div className='flex flex-col gap-y-4 py-2 text-center justify-center items-center'>
          <div className='h-10 w-10 rounded-full flex items-center justify-center bg-red-600/20 text-red-600 mx-auto'>
            <LogOut size={16} />
          </div>

          <h1 className='text-base font-semibold'>Logout?</h1>
          <p className='text-sm'>Hi <span className='text-primary/90 dark:text-sky-500/[0.9] font-semibold'>{profile?.full_name}</span>, Are you sure you want to logout?</p>
          <p className="text-xs text-muted-foreground">Once you click on that button, You will be signed out of this account, and you will need to sign in again to be able to carry on transactions. Proceed?</p>
          <div className='flex flex-row-reverse gap-x-2 float-right justify-between md:-mb-4'>
            <Button variant={'destructive'} className='rounded-full' onClick={handleSignOut}>Yes, {"I'm"} sure</Button>
            <Button variant={'secondary'} className='rounded-full' onClick={() => setOpen(false)}>No, Forget it</Button>
          </div>
        </div>
      </DynamicModal>

      {
        loading && <LoadingOverlay loader='2' isPending={loading} />
      }
    </div>
  )
}

export default SignOutComponent
