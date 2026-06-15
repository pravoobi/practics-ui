import * as React from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import type { PageHeaderProps } from "./PageHeader.types";

const PageHeader = ({ ref, eyebrow, title, action, className, ...props }: PageHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {action && (
        <Button onClick={action.onClick} iconLeft={action.icon}>
          {action.label}
        </Button>
      )}
    </div>
  );

PageHeader.displayName = "PageHeader";

export { PageHeader };
