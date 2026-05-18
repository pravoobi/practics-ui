import type { TextareaProps as BaseTextareaProps } from "@/components/ui/textarea";

  export interface TextareaProps extends BaseTextareaProps {
    label?: string;
    error?: string;
    helperText?: string;
  }