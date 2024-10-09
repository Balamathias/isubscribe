"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Switch } from "./ui/switch"
import { cn } from "@/lib/utils"

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()

  return (
    <div className={cn("flex items-center space-y-1 flex-col", className)}>
      <Switch 
        defaultChecked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
