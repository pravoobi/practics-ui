import * as React from "react";
  import { Loader2 } from "lucide-react";
  import { Button as BaseButton } from "@/components/ui/button";
  import type { ButtonProps } from "./Button.types";

  const Button = ({ ref, loading, iconLeft, iconRight, disabled, children, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
      return (
        <BaseButton
          ref={ref}
          disabled={disabled || loading}
          aria-busy={loading}
          {...props}
        >
          {loading ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            iconLeft && React.cloneElement(iconLeft, { "aria-hidden": true })
          )}
          {children}
          {!loading &&
            iconRight &&
            React.cloneElement(iconRight, { "aria-hidden": true })}
        </BaseButton>
      );
    };

  Button.displayName = "Button";

  export { Button };