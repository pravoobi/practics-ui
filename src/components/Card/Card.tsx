import * as React from "react";
import {
  Card as CardPrimitive,
  CardHeader as CardHeaderPrimitive,
  CardTitle as CardTitlePrimitive,
  CardDescription as CardDescriptionPrimitive,
  CardContent as CardContentPrimitive,
  CardFooter as CardFooterPrimitive,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./Card.types";

const variantMap: Record<string, string> = {
  default: "",
  outline: "border-2 shadow-none",
  ghost: "border-transparent shadow-none bg-transparent",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <CardPrimitive
      ref={ref}
      className={cn(variantMap[variant], className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <CardHeaderPrimitive ref={ref} className={className} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <CardTitlePrimitive ref={ref} className={className} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <CardDescriptionPrimitive ref={ref} className={className} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ padding, className, ...props }, ref) => {
    const paddingClass = padding !== undefined ? `p-${padding}` : undefined;
    return (
      <CardContentPrimitive
        ref={ref}
        className={cn(paddingClass, className)}
        {...props}
      />
    );
  },
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <CardFooterPrimitive ref={ref} className={className} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
