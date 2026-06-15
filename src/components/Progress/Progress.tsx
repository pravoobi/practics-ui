import * as React from "react";
  import { Progress as ProgressPrimitive } from "@/components/ui/progress";
  import { cn } from "@/lib/utils";
  import type { ProgressProps, ProgressVariant, ProgressSize } from "./Progress.types";

  const variantMap: Record<ProgressVariant, string> = {
    default: "",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-destructive",
  };

  const sizeMap: Record<ProgressSize, string> = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  };

  const Progress = ({ ref, value = 0,
        variant = "default",
        size = "md",
        label,
        showValue = false,
        className,
        ...props }: ProgressProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-1">
            {label && (
              <span className="text-sm text-muted-foreground">{label}</span>
            )}
            {showValue && (
              <span className="text-sm font-medium ml-auto">{Math.min(100, Math.max(0, value))}%</span>
            )}
          </div>
        )}
        <ProgressPrimitive
          ref={ref}
          value={value}
          className={cn(sizeMap[size], className)}
          fillClassName={variantMap[variant]}
          {...props}
        />
      </div>
    );
  Progress.displayName = "Progress";

  export { Progress };