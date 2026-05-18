import * as React from "react";

  export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }

  export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
  }

  export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
  }