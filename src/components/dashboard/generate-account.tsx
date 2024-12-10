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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const bvn = formData.get('bvn') as string

    generateAccount(bvn)
  }

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
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
            <Label htmlFor="bvn" className='text-muted-foreground font-semibold'>BVN</Label>
            <Input className='h-12' id="bvn" name='bvn' placeholder='Enter your BVN Number to continue.' />


            <Button
                className='rounded-full bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1 mt-2.5'
                variant={'secondary'}
                size={'lg'}
                disabled={isPending}
            >
                {
                    isPending ? <LucideSparkles className='animate-spin' size={16} /> : <LucideSparkles size={16} />
                }
                {
                    isPending ? "Generating..." : "Generate Account"
                }
            </Button>
        </form>

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