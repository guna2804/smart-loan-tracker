import * as React from "react"
import { Button as MuiButton } from "@mui/material"
import type { ButtonProps as MuiButtonProps } from "@mui/material"
import { styled } from "@mui/material/styles"

// Map our variant names to MUI variants
const variantMapping = {
  default: "contained",
  destructive: "contained",
  outline: "outlined",
  secondary: "contained",
  ghost: "text",
  link: "text",
} as const

// Map our size names to MUI sizes
const sizeMapping = {
  default: "medium",
  sm: "small",
  lg: "large",
  icon: "medium",
} as const

const StyledButton = styled(MuiButton)(
  ({ theme }) => ({
    // Custom styling based on data attributes
    '&[data-variant="destructive"]': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    '&[data-variant="secondary"]': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
    },
    '&[data-variant="ghost"]': {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    '&[data-variant="link"]': {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
      textDecoration: "underline",
      textDecorationThickness: "2px",
      textUnderlineOffset: "4px",
      "&:hover": {
        backgroundColor: "transparent",
        textDecorationThickness: "2px",
      },
    },
    // Icon button styling
    '&[data-size="icon"]': {
      minWidth: "40px",
      width: "40px",
      height: "40px",
      padding: theme.spacing(1),
    },
  })
)

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", ...props }, ref) => {
    const muiVariant = variantMapping[variant] || "contained"
    const muiSize = sizeMapping[size] || "medium"

    return (
      <StyledButton
        ref={ref}
        variant={muiVariant}
        size={muiSize}
        data-variant={variant}
        data-size={size}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

// Export buttonVariants for compatibility with existing components
export const buttonVariants = ({ variant = "default", size = "default" }: { variant?: string; size?: string } = {}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default}`
}

export { Button }
