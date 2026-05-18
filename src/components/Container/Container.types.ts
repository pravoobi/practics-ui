import type { BoxProps } from "@/components/Box";

  export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

  export interface ContainerProps extends Omit<BoxProps, "marginX"> {
    size?: ContainerSize;
  }