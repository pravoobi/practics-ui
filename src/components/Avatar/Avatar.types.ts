import * as React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

  export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
    className?: string;
  }