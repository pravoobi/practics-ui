import * as React from "react";

  export type ProgressVariant = "default" | "success" | "warning" | "destructive";
  export type ProgressSize = "sm" | "md" | "lg";

  export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    variant?: ProgressVariant;
    size?: ProgressSize;
    label?: string;
    showValue?: boolean;
    className?: string;
  }