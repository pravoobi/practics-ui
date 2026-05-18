import type { ButtonProps as BaseButtonProps } from "@/components/ui/button";

  export interface ButtonProps extends Omit<BaseButtonProps, "asChild"> {
    loading?: boolean;
    iconLeft?: React.ReactElement;
    iconRight?: React.ReactElement;
  }