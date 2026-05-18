import * as React from "react";

  export type SpacingScale = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;

  export type DisplayValue =
    | "block"
    | "flex"
    | "grid"
    | "inline"
    | "inline-flex"
    | "hidden";

  export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    padding?: SpacingScale;
    paddingX?: SpacingScale;
    paddingY?: SpacingScale;
    margin?: SpacingScale;
    marginX?: SpacingScale;
    marginY?: SpacingScale;
    display?: DisplayValue;
  }