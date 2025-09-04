import * as React from "react"
import ReactSwitch from "react-switch"

import { cn } from "@/lib/utils"

interface SwitchProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, className }, ref) => (
    <div ref={ref} className={cn("", className)}>
      <ReactSwitch
        checked={checked}
        onChange={onCheckedChange}
        disabled={disabled}
        onColor="#2563eb"
        offColor="#e5e7eb"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        height={24}
        width={44}
        className="react-switch"
      />
    </div>
  )
)

Switch.displayName = "Switch"

export { Switch }
