import * as React from "react"
import { Snackbar, Alert } from "@mui/material"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { open, message, severity, dismiss } = useToast()

  return (
    <Snackbar
      open={open}
      onClose={dismiss}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={dismiss}
        severity={severity}
        sx={{ width: '100%', maxWidth: 420 }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
