"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Switch } from "./ui/switch"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex items-center space-y-1 flex-col">
      <Switch 
        defaultChecked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
