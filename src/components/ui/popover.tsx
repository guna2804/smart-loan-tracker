import * as React from "react"
import { Popover as MuiPopover } from "@mui/material"

interface PopoverPropsCustom {
  children: React.ReactNode
}

const Popover: React.FC<PopoverPropsCustom> = ({ children }) => {
  return <>{children}</>
}

interface PopoverTriggerProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}

interface PopoverContentProps {
  anchorEl?: HTMLElement | null
  open?: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
}

const PopoverContent: React.FC<PopoverContentProps> = ({
  anchorEl,
  open,
  onClose,
  children,
  className
}) => {
  return (
    <MuiPopover
      open={open || false}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          p: 2,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: 1,
        },
        className,
      }}
    >
      {children}
    </MuiPopover>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
