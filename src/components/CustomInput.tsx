import React from 'react'
import { Input } from './ui/input'
import { LucideIcon, LucideUser2 } from 'lucide-react'

interface CustomInputProps {
    Icon?: LucideIcon,
    placeholder?: string,
    disabled?:boolean,
    value?: string,
    defaultValue?: string,
    name?: string,
    type?: 'password' | 'text' | 'search' | 'email',
    id?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean
}

const CustomInput = ({
    Icon,
    defaultValue,
    disabled,
    id,
    name,
    placeholder,
    type,
    value,
    onChange,
    required
}: CustomInputProps) => {
  return (
    <div className='flex-row gap-x-2 h-12 w-full flex justify-center items-center rounded-lg bg-secondary/70 px-2.5'>
        {Icon ? <Icon className="text-muted-foreground h-5 w-5 md:h-8 md:w-8" /> : <LucideUser2 className='text-muted-foreground h-5 w-5 md:h-8 md:w-8' />}
        <Input 
            placeholder={placeholder} 
            className='w-full h-full border-none focus:border-none outline-none focus:outline-none focus-visible:ring-none focus-visible:ring-0 focus:ring-0 p-0 focus-within:ring-none bg-inherit rounded-lg shadow-none px-1'
            disabled={disabled ? disabled : false} 
            defaultValue={defaultValue}
            value={value}
            type={type}
            name={name}
            id={id}
            onChange={onChange}
            required={required}
        />
    </div>
  )
}

export default CustomInput
