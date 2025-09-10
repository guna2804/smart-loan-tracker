import * as React from "react"
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Checkbox,
} from "@mui/material"
import { Check, RadioButtonUnchecked } from "@mui/icons-material"

interface DropdownMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <>{children}</>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}

interface DropdownMenuContentProps {
  anchorEl?: HTMLElement | null
  open?: boolean
  onClose?: () => void
  children: React.ReactNode
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  anchorEl,
  open,
  onClose,
  children
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open || false}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 120,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }
      }}
    >
      {children}
    </Menu>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  inset?: boolean
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick, inset }) => {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        pl: inset ? 4 : 2,
        pr: 2,
        py: 1.5,
        fontSize: '0.875rem',
      }}
    >
      {children}
    </MenuItem>
  )
}

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  children,
  checked,
  onCheckedChange
}) => {
  return (
    <MenuItem
      onClick={() => onCheckedChange?.(!checked)}
      sx={{ pl: 4, pr: 2, py: 1.5 }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <Checkbox
          checked={checked}
          size="small"
          sx={{ p: 0 }}
        />
      </ListItemIcon>
      <ListItemText primary={children} />
    </MenuItem>
  )
}

interface DropdownMenuRadioItemProps {
  children: React.ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({
  children,
  checked,
  onCheckedChange
}) => {
  return (
    <MenuItem
      onClick={() => onCheckedChange?.(!checked)}
      sx={{ pl: 4, pr: 2, py: 1.5 }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        {checked ? (
          <Check sx={{ fontSize: 16 }} />
        ) : (
          <RadioButtonUnchecked sx={{ fontSize: 16 }} />
        )}
      </ListItemIcon>
      <ListItemText primary={children} />
    </MenuItem>
  )
}

interface DropdownMenuLabelProps {
  children: React.ReactNode
  inset?: boolean
}

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ children, inset }) => {
  return (
    <Typography
      variant="body2"
      sx={{
        px: 2,
        py: 1.5,
        fontWeight: 600,
        fontSize: '0.875rem',
        pl: inset ? 4 : 2,
        color: 'text.secondary',
      }}
    >
      {children}
    </Typography>
  )
}

const DropdownMenuSeparator: React.FC = () => {
  return <Divider sx={{ my: 1 }} />
}

interface DropdownMenuShortcutProps {
  children: React.ReactNode
}

const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({ children }) => {
  return (
    <Typography
      variant="caption"
      sx={{
        ml: 'auto',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        opacity: 0.6,
      }}
    >
      {children}
    </Typography>
  )
}

// Placeholder components for compatibility
const DropdownMenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const DropdownMenuPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const DropdownMenuSub: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const DropdownMenuSubContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const DropdownMenuSubTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const DropdownMenuRadioGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
