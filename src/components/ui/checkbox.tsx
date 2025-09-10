import * as React from "react";
import { Checkbox as MuiCheckbox } from "@mui/material";
import type { CheckboxProps as MuiCheckboxProps } from "@mui/material";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
      props.onChange?.(event);
    };

    return (
      <MuiCheckbox
        ref={ref}
        onChange={handleChange}
        sx={{
          padding: 0,
          '& .MuiSvgIcon-root': {
            fontSize: '1rem',
          },
        }}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
