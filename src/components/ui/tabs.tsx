import * as React from "react"
import { Tabs as MuiTabs, Tab, Box } from "@mui/material"

interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onValueChange?.(newValue)
  }

  let tabsListClassName = ''
  const tabs = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === TabsList) {
      tabsListClassName = child.props.className || ''
      return child.props.children
    }
    return null
  })

  return (
    <Box sx={{ width: '100%' }}>
      <MuiTabs
        value={value}
        onChange={handleChange}
        className={tabsListClassName}
        sx={{
          minHeight: 40,
          '& .MuiTabs-indicator': {
            height: 2,
          },
        }}
      >
        {tabs}
      </MuiTabs>

      <Box sx={{ mt: 2 }}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TabsContent && child.props.value === value) {
            return child
          }
          return null
        })}
      </Box>
    </Box>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <Box className={className}>
      {children}
    </Box>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  return (
    <Tab
      value={value}
      label={children}
      sx={{
        minHeight: 32,
        borderRadius: 0.5,
        px: 3,
        py: 1.5,
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        '&.Mui-selected': {
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      }}
      className={className}
    />
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  // This component will be rendered conditionally by the parent Tabs component
  return (
    <Box sx={{ mt: 2 }} className={className} data-tab-value={value}>
      {children}
    </Box>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
