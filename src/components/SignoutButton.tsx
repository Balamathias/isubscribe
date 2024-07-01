'use client'

import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { signOut } from '@/lib/supabase/user.actions'
import clsx from 'clsx'

const SignoutButton = ({ className }: { className?: string }) => {
  return (
    <Button onClick={ async () => await signOut()} size='sm' variant='destructive' className={clsx('flex items-center gap-1.5 border-none shadow-none', className)}>
        Logout <ArrowRight size={16} className='text-rose-50'/>
    </Button>
  )
}

export default SignoutButton