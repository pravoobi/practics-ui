import * as React from "react";
  import { cn } from "@/lib/utils";

  const Progress = ({ ref, className, value = 0, fillClassName, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: number; fillClassName?: string; ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full bg-primary transition-all duration-300 ease-in-out", fillClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
  Progress.displayName = "Progress";

  export { Progress };