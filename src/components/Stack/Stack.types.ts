 import type { BoxProps } from "@/components/Box";

  export type StackDirection = "row" | "column" | "row-reverse" | "column-reverse";
  export type StackGap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
  export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
  export type StackJustify =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly";

  export interface StackProps extends Omit<BoxProps, "display"> {
    direction?: StackDirection;
    gap?: StackGap;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
  }