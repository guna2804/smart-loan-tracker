"use client"

import * as React from "react"
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const DialogContext = React.createContext<{ onOpenChange?: (open: boolean) => void }>({});

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <MuiDialog
        open={open || false}
        onClose={() => onOpenChange?.(false)}
        maxWidth="sm"
        fullWidth
      >
        {children}
      </MuiDialog>
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
  return <>{children}</>
}

const DialogClose: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return (
    <MuiDialogContent sx={{ p: 3 }} className={className}>
      {children}
    </MuiDialogContent>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}>
      {children}
    </div>
  )
}

interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <MuiDialogActions sx={{ p: 3, pt: 0 }} className={className}>
      {children}
    </MuiDialogActions>
  )
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  const { onOpenChange } = React.useContext(DialogContext);

  return (
    <MuiDialogTitle sx={{ m: 0, p: 3, pb: 1 }} className={className}>
      {children}
      <IconButton
        aria-label="close"
        onClick={() => onOpenChange?.(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  )
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className }) => {
  return (
    <div className={`text-sm text-muted-foreground ${className || ''}`}>
      {children}
    </div>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
