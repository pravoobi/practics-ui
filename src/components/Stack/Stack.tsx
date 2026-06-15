import * as React from "react";
  import { Box } from "@/components/Box";
  import { cn } from "@/lib/utils";
  import type {
    StackProps,
    StackDirection,
    StackGap,
    StackAlign,
    StackJustify,
  } from "./Stack.types";

  const directionMap: Record<StackDirection, string> = {
    row: "flex-row",
    column: "flex-col",
    "row-reverse": "flex-row-reverse",
    "column-reverse": "flex-col-reverse",
  };

  const gapMap: Record<StackGap, string> = {
    0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4",
    6: "gap-6", 8: "gap-8", 12: "gap-12", 16: "gap-16",
  };

  const alignMap: Record<StackAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyMap: Record<StackJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const Stack = ({ ref, direction = "row",
        gap,
        align,
        justify,
        wrap,
        className,
        ...props }: StackProps & { ref?: React.Ref<HTMLElement> }) => {
      return (
        <Box
          ref={ref}
          display="flex"
          className={cn(
            directionMap[direction],
            gap !== undefined && gapMap[gap],
            align && alignMap[align],
            justify && justifyMap[justify],
            wrap && "flex-wrap",
            className
          )}
          {...props}
        />
      );
    };

  Stack.displayName = "Stack";

  export { Stack };