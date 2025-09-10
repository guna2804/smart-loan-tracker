"use client"

import * as React from "react"
import { LinearProgress } from "@mui/material"
import type { LinearProgressProps } from "@mui/material"

interface ProgressProps extends Omit<LinearProgressProps, "variant"> {
  value?: number
  className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, ...props }, ref) => (
    <LinearProgress
      ref={ref}
      variant="determinate"
      value={value || 0}
      sx={{
        height: 16,
        borderRadius: 2,
        backgroundColor: 'grey.300',
        '& .MuiLinearProgress-bar': {
          borderRadius: 2,
        },
      }}
      className={className}
      {...props}
    />
  )
)

Progress.displayName = "Progress"

export { Progress }
