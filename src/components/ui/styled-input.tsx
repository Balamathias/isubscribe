import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { LucideIcon } from "lucide-react"

interface StyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: boolean
  className?: string
}

const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3 h-5 w-5 text-muted-foreground" />
        )}
        <Input
          className={cn(
            "h-12 rounded-lg bg-secondary/70 px-4",
            "border border-muted transition-colors",
            "focus:border-violet-500 focus:ring-1 focus:ring-violet-500",
            "placeholder:text-muted-foreground/60",
            Icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
StyledInput.displayName = "StyledInput"

export { StyledInput } 