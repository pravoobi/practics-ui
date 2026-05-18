 import * as React from "react";
  import { cn } from "@/lib/utils";
  import type { BoxProps, SpacingScale, DisplayValue } from "./Box.types";

  const paddingMap: Record<SpacingScale, string> = {
    0: "p-0", 1: "p-1", 2: "p-2", 3: "p-3", 4: "p-4",
    6: "p-6", 8: "p-8", 12: "p-12", 16: "p-16",
  };

  const paddingXMap: Record<SpacingScale, string> = {
    0: "px-0", 1: "px-1", 2: "px-2", 3: "px-3", 4: "px-4",
    6: "px-6", 8: "px-8", 12: "px-12", 16: "px-16",
  };

  const paddingYMap: Record<SpacingScale, string> = {
    0: "py-0", 1: "py-1", 2: "py-2", 3: "py-3", 4: "py-4",
    6: "py-6", 8: "py-8", 12: "py-12", 16: "py-16",
  };

  const marginMap: Record<SpacingScale, string> = {
    0: "m-0", 1: "m-1", 2: "m-2", 3: "m-3", 4: "m-4",
    6: "m-6", 8: "m-8", 12: "m-12", 16: "m-16",
  };

  const marginXMap: Record<SpacingScale, string> = {
    0: "mx-0", 1: "mx-1", 2: "mx-2", 3: "mx-3", 4: "mx-4",
    6: "mx-6", 8: "mx-8", 12: "mx-12", 16: "mx-16",
  };

  const marginYMap: Record<SpacingScale, string> = {
    0: "my-0", 1: "my-1", 2: "my-2", 3: "my-3", 4: "my-4",
    6: "my-6", 8: "my-8", 12: "my-12", 16: "my-16",
  };

  const displayMap: Record<DisplayValue, string> = {
    block: "block",
    flex: "flex",
    grid: "grid",
    inline: "inline",
    "inline-flex": "inline-flex",
    hidden: "hidden",
  };

  const Box = React.forwardRef<HTMLElement, BoxProps>(
    (
      {
        as: Component = "div",
        padding,
        paddingX,
        paddingY,
        margin,
        marginX,
        marginY,
        display,
        className,
        ...props
      },
      ref
    ) => {
      return (
        <Component
          ref={ref}
          className={cn(
            padding !== undefined && paddingMap[padding],
            paddingX !== undefined && paddingXMap[paddingX],
            paddingY !== undefined && paddingYMap[paddingY],
            margin !== undefined && marginMap[margin],
            marginX !== undefined && marginXMap[marginX],
            marginY !== undefined && marginYMap[marginY],
            display && displayMap[display],
            className
          )}
          {...props}
        />
      );
    }
  );

  Box.displayName = "Box";

  export { Box };