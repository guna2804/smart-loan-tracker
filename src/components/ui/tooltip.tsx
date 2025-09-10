"use client"

import * as React from "react"
import { Tooltip as MuiTooltip } from "@mui/material"

interface TooltipProviderProps {
  children: React.ReactNode
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>
}

interface TooltipPropsCustom {
  children: React.ReactNode
  content?: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

const Tooltip: React.FC<TooltipPropsCustom> = ({
  children,
  content,
  side = "top",
  className
}) => {
  if (!content) {
    return <>{children}</>
  }

  return (
    <MuiTooltip
      title={content}
      placement={side}
      arrow
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: 1,
          fontSize: '0.875rem',
          px: 2,
          py: 1,
        },
        '& .MuiTooltip-arrow': {
          color: 'background.paper',
          '&::before': {
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          },
        },
      }}
      className={className}
    >
      <div style={{ display: 'inline-block' }}>
        {children}
      </div>
    </MuiTooltip>
  )
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  return <>{children}</>
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
  sideOffset?: number
}

const TooltipContent: React.FC<TooltipContentProps> = ({ children, className }) => {
  return (
    <div className={`text-sm ${className || ''}`}>
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
