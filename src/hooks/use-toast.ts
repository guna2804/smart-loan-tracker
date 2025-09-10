"use client"

import * as React from "react"

interface ToastOptions {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

interface ToastState {
  open: boolean
  message: string
  severity: "success" | "error" | "info" | "warning"
  title?: string
  description?: string
}

let toastState: ToastState = {
  open: false,
  message: "",
  severity: "info",
}

const listeners: Array<(state: ToastState) => void> = []

function notifyListeners() {
  listeners.forEach((listener) => listener(toastState))
}

function showToast(options: ToastOptions) {
  const { title, description, variant = "default", duration = 6000 } = options

  const message = title || description || ""
  const severity = variant === "destructive" ? "error" : variant === "success" ? "success" : "info"

  toastState = {
    open: true,
    message,
    severity,
    title,
    description,
  }

  notifyListeners()

  // Auto-hide after duration
  setTimeout(() => {
    toastState = { ...toastState, open: false }
    notifyListeners()
  }, duration)
}

function dismissToast() {
  toastState = { ...toastState, open: false }
  notifyListeners()
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(toastState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const toast = React.useCallback((options: ToastOptions) => {
    showToast(options)
    return {
      dismiss: dismissToast,
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: dismissToast,
  }
}

export { useToast, showToast, dismissToast }
