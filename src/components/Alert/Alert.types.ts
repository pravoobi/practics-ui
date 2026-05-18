import * as React from "react";
  import type { VariantProps } from "class-variance-authority";
  import type { alertVariants } from "@/components/ui/alert";

  export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

  export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
    className?: string;
  }

  export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
  }

  export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
  }