import * as React from "react";
  import {
    Alert as AlertPrimitive,
    AlertTitle as AlertTitlePrimitive,
    AlertDescription as AlertDescriptionPrimitive,
  } from "@/components/ui/alert";
  import { cn } from "@/lib/utils";
  import type { AlertProps, AlertTitleProps, AlertDescriptionProps } from "./Alert.types";

  const extraVariantMap: Record<string, string> = {
    info: "border-blue-500/50 text-blue-700 [&>svg]:text-blue-700",
    success: "border-green-500/50 text-green-700 [&>svg]:text-green-700",
    warning: "border-yellow-500/50 text-yellow-700 [&>svg]:text-yellow-700",
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ variant = "default", className, ...props }, ref) => {
      const isExtra = variant === "info" || variant === "success" || variant === "warning";

      if (isExtra) {
        return (
          <AlertPrimitive
            ref={ref}
            variant="default"
            className={cn(extraVariantMap[variant], className)}
            {...props}
          />
        );
      }

      return (
        <AlertPrimitive
          ref={ref}
          variant={variant}
          className={className}
          {...props}
        />
      );
    }
  );
  Alert.displayName = "Alert";

  const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
    ({ className, ...props }, ref) => (
      <AlertTitlePrimitive ref={ref} className={className} {...props} />
    )
  );
  AlertTitle.displayName = "AlertTitle";

  const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
    ({ className, ...props }, ref) => (
      <AlertDescriptionPrimitive ref={ref} className={className} {...props} />
    )
  );
  AlertDescription.displayName = "AlertDescription";

  export { Alert, AlertTitle, AlertDescription };