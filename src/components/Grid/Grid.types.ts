 import type { BoxProps } from "@/components/Box";
  import type { StackGap } from "@/components/Stack";

  export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  export type GridRows = 1 | 2 | 3 | 4 | 5 | 6;

  export interface GridProps extends Omit<BoxProps, "display"> {
    cols?: GridCols;
    rows?: GridRows;
    gap?: StackGap;
    gapX?: StackGap;
    gapY?: StackGap;
  }