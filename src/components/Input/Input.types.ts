import type { InputProps as BaseInputProps } from "@/components/ui/input";

  export interface InputProps extends BaseInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    iconLeft?: React.ReactElement;
    iconRight?: React.ReactElement;
  }