import * as React from "react"
import { Snackbar, Alert, Button, Box } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

interface ToastProviderProps {
  children: React.ReactNode
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return <>{children}</>
}

interface ToastViewportProps {
  className?: string
}

const ToastViewport: React.FC<ToastViewportProps> = ({ className }) => {
  return <div className={className} />
}

interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  action?: React.ReactNode
}

const Toast: React.FC<ToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  action
}) => {
  const severity = variant === "destructive" ? "error" : variant === "success" ? "success" : "info"

  return (
    <Snackbar
      open={open || false}
      onClose={() => onOpenChange?.(false)}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={() => onOpenChange?.(false)}
        severity={severity}
        sx={{ width: '100%', maxWidth: 420 }}
        action={action}
      >
        <Box>
          {title && <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>}
          {description && <div>{description}</div>}
        </Box>
      </Alert>
    </Snackbar>
  )
}

interface ToastTitleProps {
  children: React.ReactNode
  className?: string
}

const ToastTitle: React.FC<ToastTitleProps> = ({ children, className }) => {
  return <div className={`text-sm font-semibold ${className || ''}`}>{children}</div>
}

interface ToastDescriptionProps {
  children: React.ReactNode
  className?: string
}

const ToastDescription: React.FC<ToastDescriptionProps> = ({ children, className }) => {
  return <div className={`text-sm opacity-90 ${className || ''}`}>{children}</div>
}

interface ToastCloseProps {
  onClick?: () => void
  className?: string
}

const ToastClose: React.FC<ToastCloseProps> = ({ onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      size="small"
      sx={{
        minWidth: 'auto',
        p: 0.5,
        color: 'inherit',
        opacity: 0.7,
        '&:hover': { opacity: 1 }
      }}
      className={className}
    >
      <CloseIcon fontSize="small" />
    </Button>
  )
}

interface ToastActionProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const ToastAction: React.FC<ToastActionProps> = ({ children, onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      size="small"
      variant="outlined"
      sx={{
        ml: 1,
        borderColor: 'currentColor',
        color: 'currentColor',
        '&:hover': {
          borderColor: 'currentColor',
          bgcolor: 'action.hover'
        }
      }}
      className={className}
    >
      {children}
    </Button>
  )
}

type ToastPropsType = React.ComponentProps<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastPropsType as ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
