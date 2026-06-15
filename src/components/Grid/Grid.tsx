import * as React from "react";
  import { Box } from "@/components/Box";
  import { cn } from "@/lib/utils";
  import type { GridProps, GridCols, GridRows } from "./Grid.types";
  import type { StackGap } from "@/components/Stack";

  const colsMap: Record<GridCols, string> = {
    1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3",
    4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6",
    7: "grid-cols-7", 8: "grid-cols-8", 9: "grid-cols-9",
    10: "grid-cols-10", 11: "grid-cols-11", 12: "grid-cols-12",
  };

  const rowsMap: Record<GridRows, string> = {
    1: "grid-rows-1", 2: "grid-rows-2", 3: "grid-rows-3",
    4: "grid-rows-4", 5: "grid-rows-5", 6: "grid-rows-6",
  };

  const gapMap: Record<StackGap, string> = {
    0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4",
    6: "gap-6", 8: "gap-8", 12: "gap-12", 16: "gap-16",
  };

  const gapXMap: Record<StackGap, string> = {
    0: "gap-x-0", 1: "gap-x-1", 2: "gap-x-2", 3: "gap-x-3", 4: "gap-x-4",
    6: "gap-x-6", 8: "gap-x-8", 12: "gap-x-12", 16: "gap-x-16",
  };

  const gapYMap: Record<StackGap, string> = {
    0: "gap-y-0", 1: "gap-y-1", 2: "gap-y-2", 3: "gap-y-3", 4: "gap-y-4",
    6: "gap-y-6", 8: "gap-y-8", 12: "gap-y-12", 16: "gap-y-16",
  };

  const Grid = ({ ref, cols, rows, gap, gapX, gapY, className, ...props }: GridProps & { ref?: React.Ref<HTMLElement> }) => {
      return (
        <Box
          ref={ref}
          display="grid"
          className={cn(
            cols !== undefined && colsMap[cols],
            rows !== undefined && rowsMap[rows],
            gap !== undefined && gapMap[gap],
            gapX !== undefined && gapXMap[gapX],
            gapY !== undefined && gapYMap[gapY],
            className
          )}
          {...props}
        />
      );
    };

  Grid.displayName = "Grid";

  export { Grid };