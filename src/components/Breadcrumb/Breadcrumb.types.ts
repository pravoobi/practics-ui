import * as React from "react";

  export interface BreadcrumbItemConfig {
    label: string;
    href?: string;
  }

  export interface BreadcrumbProps {
    items: BreadcrumbItemConfig[];
    separator?: React.ReactNode;
    className?: string;
    maxItems?: number;
  }

  export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    asChild?: boolean;
    className?: string;
  }

  export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
  }