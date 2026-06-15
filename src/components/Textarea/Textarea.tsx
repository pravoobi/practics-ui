import * as React from "react";
  import { cn } from "@/lib/utils";
  import { Textarea as BaseTextarea } from "@/components/ui/textarea";
  import type { TextareaProps } from "./Textarea.types";

  const Textarea = ({ ref, label, error, helperText, className, id, ...props }: TextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) => {
      const textareaId = id ?? React.useId();
      const helperId = `${textareaId}-helper`;
      const errorId = `${textareaId}-error`;

      return (
        <div className="flex flex-col gap-1.5 w-full">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-sm font-medium text-foreground"
            >
              {label}
            </label>
          )}
          <BaseTextarea
            id={textareaId}
            ref={ref}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={error ? true : undefined}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
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
    };

  Textarea.displayName = "Textarea";

  export { Textarea };