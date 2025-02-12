"use client"

import * as React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function ResetPinOTPInput({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = React.useState("")

  React.useEffect(() => { onChange(value) }, [value])

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={5}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
