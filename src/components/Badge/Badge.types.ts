import type { VariantProps } from "class-variance-authority";
  import type { badgeVariants } from "@/components/ui/badge";

  export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    className?: string;
  }