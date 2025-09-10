"use client"

import * as React from "react"
import { Tooltip } from "@mui/material"

interface HoverCardProps {
  children: React.ReactNode
}

const HoverCard: React.FC<HoverCardProps> = ({ children }) => {
  return <>{children}</>
}

interface HoverCardTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const HoverCardTrigger: React.FC<HoverCardTriggerProps> = ({ children }) => {
  return <>{children}</>
}

interface HoverCardContentProps {
  children: React.ReactNode
  className?: string
  title?: string
}

const HoverCardContent: React.FC<HoverCardContentProps> = ({
  children,
  className,
  title
}) => {
  return (
    <Tooltip
      title={title || ""}
      placement="top"
      arrow
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: 1,
          p: 2,
          maxWidth: 256,
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
      <div>{children}</div>
    </Tooltip>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
