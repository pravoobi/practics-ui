import * as React from "react";

  export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  export interface SelectOptionGroup {
    label: string;
    options: SelectOption[];
  }

  export interface SelectProps {
    options?: SelectOption[];
    groups?: SelectOptionGroup[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
  }

  export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
  }

  export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
    className?: string;
  }

  export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }