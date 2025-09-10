"use client"

import * as React from "react"
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onValueChange?.(event.target.value)
  }

  // Extract trigger className and menu items from children
  const { triggerClassName, menuItems } = React.useMemo(() => {
    let className = ''
    const items: React.ReactElement[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // If it's a SelectTrigger, extract its className
        if (child.type === SelectTrigger && 'className' in child.props) {
          className = child.props.className || ''
        }
        // If it's a SelectItem, convert it to MenuItem
        else if ('value' in child.props && 'children' in child.props) {
          const props = child.props as SelectItemProps
          items.push(
            <MenuItem key={props.value} value={props.value}>
              {props.children}
            </MenuItem>
          )
        }
        // If it's a SelectContent, extract its SelectItem children
        else if (child.type === SelectContent && 'children' in child.props) {
          const contentProps = child.props as SelectContentProps
          React.Children.forEach(contentProps.children, (contentChild) => {
            if (React.isValidElement(contentChild) && 'value' in contentChild.props && 'children' in contentChild.props) {
              const itemProps = contentChild.props as SelectItemProps
              items.push(
                <MenuItem key={itemProps.value} value={itemProps.value}>
                  {itemProps.children}
                </MenuItem>
              )
            }
          })
        }
      }
    })

    return { triggerClassName: className, menuItems: items }
  }, [children])

  return (
    <FormControl className={triggerClassName} sx={{ minWidth: triggerClassName ? 'auto' : '100%' }}>
      <MuiSelect
        value={value || ""}
        onChange={handleChange}
        displayEmpty
        sx={{
          height: 40,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: 2,
          },
        }}
      >
        {menuItems}
      </MuiSelect>
    </FormControl>
  )
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

const SelectTrigger: React.FC<SelectTriggerProps> = () => {
  // This component is just a placeholder for className extraction
  // The actual rendering is handled by the parent Select component
  return null
}

interface SelectValueProps {
  placeholder?: string
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  // This component is just a placeholder for compatibility
  // The actual value display is handled by MUI Select
  // But we can return a placeholder if needed
  return placeholder ? <span>{placeholder}</span> : null
}

interface SelectContentProps {
  children: React.ReactNode
}

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  return <>{children}</>
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return (
    <MenuItem value={value} sx={{ pl: 4, pr: 2, py: 1.5 }}>
      {children}
    </MenuItem>
  )
}

interface SelectLabelProps {
  children: React.ReactNode
}

const SelectLabel: React.FC<SelectLabelProps> = ({ children }) => {
  return (
    <InputLabel sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
      {children}
    </InputLabel>
  )
}

const SelectSeparator: React.FC = () => {
  return <Divider sx={{ my: 1 }} />
}

// Placeholder components for compatibility
const SelectGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const SelectScrollUpButton: React.FC = () => null
const SelectScrollDownButton: React.FC = () => null

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
