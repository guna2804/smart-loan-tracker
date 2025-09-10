"use client"

import * as React from "react"
import { Collapse } from "@mui/material"

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Collapsible: React.FC<CollapsibleProps> = ({ open, onOpenChange, children }) => {
  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // First child is the trigger
          return React.cloneElement(child as React.ReactElement, {
            onClick: () => onOpenChange?.(!open),
          })
        } else {
          // Other children are content
          return (
            <Collapse in={open}>
              {child}
            </Collapse>
          )
        }
      })}
    </div>
  )
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  onClick?: () => void
}

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}

interface CollapsibleContentProps {
  children: React.ReactNode
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({ children }) => {
  return <div>{children}</div>
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
