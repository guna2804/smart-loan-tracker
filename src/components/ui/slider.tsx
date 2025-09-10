import * as React from "react"
import { Slider as MuiSlider } from "@mui/material"
import type { SliderProps as MuiSliderProps } from "@mui/material"

interface SliderProps extends Omit<MuiSliderProps, "onChange"> {
  value?: number | number[]
  onValueChange?: (value: number | number[]) => void
  onChange?: (event: Event, value: number | number[], activeThumb: number) => void
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const handleChange = (_event: Event, newValue: number | number[]) => {
      onValueChange?.(newValue)
    }

    return (
      <MuiSlider
        ref={ref}
        value={value}
        onChange={handleChange}
        sx={{
          color: 'primary.main',
          '& .MuiSlider-thumb': {
            width: 20,
            height: 20,
            border: '2px solid currentColor',
            backgroundColor: 'background.paper',
            '&:focus, &:hover, &.Mui-active': {
              boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
            },
          },
          '& .MuiSlider-track': {
            height: 8,
            borderRadius: 4,
          },
          '& .MuiSlider-rail': {
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.300',
          },
        }}
        className={className}
        {...props}
      />
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
