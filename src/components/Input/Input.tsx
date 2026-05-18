 import * as React from "react";
  import { cn } from "@/lib/utils";
  import { Input as BaseInput } from "@/components/ui/input";
  import type { InputProps } from "./Input.types";

  const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        error,
        helperText,
        iconLeft,
        iconRight,
        className,
        id,
        ...props
      },
      ref
    ) => {
      const inputId = id ?? React.useId();
      const helperId = `${inputId}-helper`;
      const errorId = `${inputId}-error`;

      return (
        <div className="flex flex-col gap-1.5 w-full">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-foreground"
            >
              {label}
            </label>
          )}
          <div className="relative">
            {iconLeft && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {React.cloneElement(iconLeft, {
                  "aria-hidden": true,
                  className: cn("h-4 w-4", iconLeft.props.className),
                })}
              </span>
            )}
            <BaseInput
              id={inputId}
              ref={ref}
              aria-describedby={
                error ? errorId : helperText ? helperId : undefined
              }
              aria-invalid={error ? true : undefined}
              className={cn(
                iconLeft && "pl-9",
                iconRight && "pr-9",
                error && "border-destructive focus-visible:ring-destructive",
                className
              )}
              {...props}
            />
            {iconRight && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {React.cloneElement(iconRight, {
                  "aria-hidden": true,
                  className: cn("h-4 w-4", iconRight.props.className),
                })}
              </span>
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
    }
  );

  Input.displayName = "Input";

  export { Input };