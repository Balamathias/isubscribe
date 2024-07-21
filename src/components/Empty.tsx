import { Card } from '@/components/ui/card'
import clsx from 'clsx';
import { BarChart } from 'lucide-react'
import React from 'react'

declare interface EmptyProps {
    icon?: React.ReactNode;
    content?: string;
    color?: 'red' | 'green' | 'blue' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray',
    className?: string;
    title?: string;
}

const Empty = ({color, content, icon, className, title}: EmptyProps) => {
  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      <Card className="bg-white dark:bg-card/50 p-4 h flex flex-col items-center justify-center gap-y-2 md:gap-y-2.5 rounded-xl border-none shadow-none drop-shadow-none">
            <div className={`p-2 bg-${color ?? 'red'}-100 rounded-full`}>
             { icon ? icon : <BarChart className={`text-${color ?? 'red'}-500`} />}
            </div>
            {title && <p className="text-lg font-semibold text-muted-foreground text-center">{title}</p>}
            {
                content ? <p className="text-muted-foreground text-sm text-center md:text-base">{content}</p> :
                <p className="text-muted-foreground text-center text-sm md:text-base">There is nothing here right now.</p>
            }
        </Card>
    </div>
  )
}

export default Empty
