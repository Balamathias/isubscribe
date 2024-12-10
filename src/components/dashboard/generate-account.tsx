"use client"

import React from 'react'
import { useGenerateAcount } from '@/lib/react-query/funcs/accounts'
import DynamicModal from '../DynamicModal'
import { Button } from '../ui/button'
import { LucideLoader, LucideSparkles } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface Props {
    withBVN?: boolean
}

const GenerateAccount = ({ withBVN=false }: Props) => {
  const { mutate: generateAccount, isPending } = useGenerateAcount()

  return withBVN ? (
    <DynamicModal
        trigger={
            <Button
                className='rounded-full bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1'
                variant={'secondary'}
                size={'lg'}
                disabled={isPending}
            >
                {
                    isPending ? <LucideLoader className='animate-spin' size={16} /> : <LucideSparkles size={16} />
                }
                {
                    isPending ? "Generating..." : "Generate Account"
                }
            </Button>
        }
    >
        <div className="flex flex-col gap-y-3">
            <Label htmlFor="bvn" className='text-muted-foreground font-semibold'>BVN</Label>
            <Input className='h-12' id="bvn" name='bvn' placeholder='Enter your BVN Number to continue.' />
        </div>

    </DynamicModal>
  ) :( 
    <Button
        className='rounded-full bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1'
        variant={'secondary'}
        size={'lg'}
        disabled={isPending}
        onClick={() => {
            generateAccount(undefined, {})
        }}
    >
        {
            isPending ? <LucideLoader className='animate-spin' size={16} /> : <LucideSparkles size={16} />
        }
        {
            isPending ? "Generating..." : "Generate Account"
        }
    </Button>
)
}

export default GenerateAccount