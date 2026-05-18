import type { BoxProps } from "@/components/Box";

  export type CardVariant = "default" | "outline" | "ghost";

  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    className?: string;
  }

  export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
  }

  export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
  }

  export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    padding?: BoxProps["padding"];
  }

  export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }