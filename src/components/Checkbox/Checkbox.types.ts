 import type { CheckboxProps as BaseCheckboxProps } from "@/components/ui/checkbox";

  export interface CheckboxProps extends BaseCheckboxProps {
    label?: string;
    error?: string;
    helperText?: string;
    className?: string;
    id?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    checked?: boolean;
    "aria-label"?: string;
  }