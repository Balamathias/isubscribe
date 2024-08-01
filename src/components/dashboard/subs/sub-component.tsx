import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideBook, LucideHelpCircle, LucideLamp, LucideNetwork, LucideTv, LucideWifi } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const services = [
    {
        service: 'data',
        label: 'Buy Data',
        icon: <LucideWifi />,
        className: 'text-green-600 bg-green-600/10',
        url: '/dashboard/data'
    },
    {
        service: 'airtime',
        label: 'Buy Airtime',
        icon: <LucideNetwork />,
        className: 'text-blue-600 bg-blue-600/10',
        url: '/dashboard/airtime'
    },
    {
        service: 'tv',
        label: 'TV',
        icon: <LucideTv />,
        className: 'text-lime-600 bg-lime-600/10',
        url: '/dashboard/tv'
    },
    {
        service: 'electricity',
        label: 'Electricity',
        icon: <LucideLamp />,
        className: 'text-amber-600 bg-amber-600/10',
        url: '/dashboard/electricty'
    },
    {
        service: 'education',
        label: 'Education',
        icon: <LucideBook />,
        className: 'text-rose-600 bg-rose-600/10',
        url: '/dashboard/education'
    },
    {
        service: 'support',
        label: 'Support',
        icon: <LucideHelpCircle />,
        className: 'text-purple-600 bg-purple-600/10',
        url: '/dashboard#support'
    },
]

const SubsComponent = () => {
  return (
    <div className='flex flex-col gap-y-4 py-4'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {
                services.map(service => (
                    <Link
                        href={service.url}
                        className={cn('p-4 rounded-2xl flex flex-col gap-y-3 justify-center items-center bg-green-600/10 hover:opacity-70 hover:transition-all peer peer-hover:opacity-85 peer-hover:transition-all hover:duration-300 peer-hover:duration-300', service.className)}
                        key={service.service}
                    >
                        {service.icon}
                        <p className='font-semibold'>{service.label}</p>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default SubsComponent