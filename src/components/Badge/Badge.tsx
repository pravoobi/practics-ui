import * as React from "react";
  import { Badge as BadgePrimitive } from "@/components/ui/badge";
  import { cn } from "@/lib/utils";
  import type { BadgeProps } from "./Badge.types";

  const extraVariantMap: Record<string, string> = {
    success: "border-transparent bg-green-500 text-white",
    warning: "border-transparent bg-yellow-500 text-white",
  };

  const Badge = ({ ref, variant = "default", className, ...props }: BadgeProps & { ref?: React.Ref<HTMLDivElement> }) => {
      const isExtra = variant === "success" || variant === "warning";

      if (isExtra) {
        return (
          <BadgePrimitive
            ref={ref}
            variant="default"
            className={cn(extraVariantMap[variant], className)}
            {...props}
          />
        );
      }

      return (
        <BadgePrimitive
          ref={ref}
          variant={variant}
          className={className}
          {...props}
        />
      );
    };

  Badge.displayName = "Badge";

  export { Badge };