 import * as React from "react";
  import {
    Avatar as AvatarPrimitive,
    AvatarImage,
    AvatarFallback,
  } from "@/components/ui/avatar";
  import { cn } from "@/lib/utils";
  import type { AvatarProps, AvatarSize } from "./Avatar.types";

  const sizeMap: Record<AvatarSize, string> = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
    ({ src, alt, fallback, size = "md", className, ...props }, ref) => (
      <AvatarPrimitive
        ref={ref}
        className={cn(sizeMap[size], className)}
        {...props}
      >
        {src && <AvatarImage src={src} alt={alt} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </AvatarPrimitive>
    )
  );
  Avatar.displayName = "Avatar";

  export { Avatar };