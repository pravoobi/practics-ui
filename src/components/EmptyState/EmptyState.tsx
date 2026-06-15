import * as React from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import type { EmptyStateProps } from "./EmptyState.types";

const EmptyState = ({ ref, icon, title, description, action, className, ...props }: EmptyStateProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 px-6 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className="text-muted-foreground [&>svg]:w-10 [&>svg]:h-10"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );

EmptyState.displayName = "EmptyState";

export { EmptyState };
