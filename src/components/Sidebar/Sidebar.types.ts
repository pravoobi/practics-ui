import * as React from "react";

  export interface NavItemConfig {
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string | number;
    isActive?: boolean;
    disabled?: boolean;
  }

  export interface NavGroupConfig {
    label?: string;
    items: NavItemConfig[];
  }

  export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
  }

  export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface NavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: React.ReactNode;
    badge?: string | number;
    isActive?: boolean;
    disabled?: boolean;
    asChild?: boolean;
    className?: string;
  }

  export interface NavGroupProps {
    group: NavGroupConfig;
    className?: string;
  }