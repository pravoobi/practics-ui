import * as React from "react";
  import { Box } from "@/components/Box";
  import { cn } from "@/lib/utils";
  import type { ContainerProps, ContainerSize } from "./Container.types";

  const sizeMap: Record<ContainerSize, string> = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-full",
  };

  const Container = React.forwardRef<HTMLElement, ContainerProps>(
    ({ size = "lg", className, ...props }, ref) => {
      return (
        <Box
          ref={ref}
          className={cn(
            "w-full mx-auto",
            sizeMap[size],
            className
          )}
          {...props}
        />
      );
    }
  );

  Container.displayName = "Container";

  export { Container };