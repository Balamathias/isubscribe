'use client'

import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Control, FieldPath } from 'react-hook-form'
import { SignUpSchema } from '@/utils/schema/userSchema'
import { z } from 'zod'
import { LucideEye, LucideEyeOff, LucideIcon, LucideUser2 } from 'lucide-react'

interface InputFieldProps {
  label: string, 
  control: Control<z.infer<typeof SignUpSchema>>,
  name: FieldPath<z.infer<typeof SignUpSchema>>,
  placeholder?: string, 
  disabled?: boolean, 
  value?: string,
  Icon?: LucideIcon
}

const InputField = ({ 
  label, 
  control, 
  placeholder, 
  name, 
  disabled = false, 
  value,
  Icon
}: InputFieldProps) => {
    const [seePassword, setSeePassword] = React.useState(false)
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
        <FormItem>
            <FormLabel className="flex items-center justify-between my-1.5 font-bold">
              {label}
              {(name === 'password' || name === 'confirm_password') &&
                (seePassword ? (<LucideEyeOff size={14} className='cursor-pointer' onClick={() => setSeePassword(false)} />) : <LucideEye size={14} className='cursor-pointer' onClick={() => setSeePassword(true)} />)
              }
            </FormLabel>
            <FormControl>
            <div className='flex-row gap-x-2 w-full flex justify-center items-center h-12 rounded-lg bg-secondary/70 border border-muted px-2.5'>
              {Icon ? <Icon className="text-muted-foreground h-5 w-5 md:h-8 md:w-8" /> : <LucideUser2 className='text-muted-foreground h-5 w-5 md:h-8 md:w-8' />}
              <Input 
                placeholder={placeholder} 
                {...field} 
                className='w-full h-full border-none focus:border-none outline-none focus:outline-none focus-visible:ring-none focus-visible:ring-0 focus:ring-0 p-0 focus-within:ring-none bg-inherit rounded-lg shadow-none px-1'
                disabled={disabled ? disabled : false} 
                defaultValue={name === 'email' ? value : ''}
                value={field.value || ''}
                type={(name === 'password' || name === 'confirm_password') ? seePassword ? 'text' : 'password': 'text'}
              />
            </div>
            </FormControl>
            <FormMessage className='text-rose-600' />
        </FormItem>
        )}
    />
  )
}

export default InputField