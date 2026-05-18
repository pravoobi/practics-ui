 import * as React from "react";
  import { Checkbox as BaseCheckbox } from "@/components/ui/checkbox";
  import { cn } from "@/lib/utils";
  import type { CheckboxProps } from "./Checkbox.types";

  const Checkbox = React.forwardRef<
    React.ElementRef<typeof BaseCheckbox>,
    CheckboxProps
  >(({ label, error, helperText, id, className, ...props }, ref) => {
    const checkboxId = id ?? React.useId();
    const helperId = `${checkboxId}-helper`;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <BaseCheckbox
            ref={ref}
            id={checkboxId}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={error ? true : undefined}
            className={cn(
              error && "border-destructive",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  });

  Checkbox.displayName = "Checkbox";

  export { Checkbox };