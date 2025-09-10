import * as React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <Dialog
      open={open || false}
      onClose={() => onOpenChange?.(false)}
      maxWidth="sm"
      fullWidth
    >
      {children}
    </Dialog>
  )
}

interface AlertDialogTriggerProps {
  children: React.ReactNode
  onClick?: () => void
}

const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}

const AlertDialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <DialogContent sx={{ p: 3 }} className={className}>
      {children}
    </DialogContent>
  )
}

const AlertDialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className || ''}`}>
      {children}
    </div>
  )
}

const AlertDialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <DialogActions sx={{ p: 3, pt: 0 }} className={className}>
      {children}
    </DialogActions>
  )
}

const AlertDialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <DialogTitle sx={{ m: 0, p: 3, pb: 1 }} className={className}>
      <Typography variant="h6" component="div">
        {children}
      </Typography>
    </DialogTitle>
  )
}

const AlertDialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }} className={className}>
      {children}
    </Typography>
  )
}

interface AlertDialogActionProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  children,
  onClick,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      className={className}
    >
      {children}
    </Button>
  )
}

interface AlertDialogCancelProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
  children,
  onClick,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      className={className}
      sx={{ mt: { xs: 1, sm: 0 } }}
    >
      {children}
    </Button>
  )
}

// Placeholder components for compatibility
const AlertDialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const AlertDialogOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
