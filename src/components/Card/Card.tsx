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

const Card = ({ ref, variant = "default", className, ...props }: CardProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <CardPrimitive
      ref={ref}
      className={cn(variantMap[variant], className)}
      {...props}
    />
  );
Card.displayName = "Card";

const CardHeader = ({ ref, className, ...props }: CardHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <CardHeaderPrimitive ref={ref} className={className} {...props} />
  );
CardHeader.displayName = "CardHeader";

const CardTitle = ({ ref, className, ...props }: CardTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => (
    <CardTitlePrimitive ref={ref} className={className} {...props} />
  );
CardTitle.displayName = "CardTitle";

const CardDescription = ({ ref, className, ...props }: CardDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => (
  <CardDescriptionPrimitive ref={ref} className={className} {...props} />
);
CardDescription.displayName = "CardDescription";

const CardContent = ({ ref, padding, className, ...props }: CardContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
    const paddingClass = padding !== undefined ? `p-${padding}` : undefined;
    return (
      <CardContentPrimitive
        ref={ref}
        className={cn(paddingClass, className)}
        {...props}
      />
    );
  };
CardContent.displayName = "CardContent";

const CardFooter = ({ ref, className, ...props }: CardFooterProps & { ref?: React.Ref<HTMLDivElement> }) => (
    <CardFooterPrimitive ref={ref} className={className} {...props} />
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
