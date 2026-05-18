import * as React from "react";

  export interface TabItem {
    value: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }

  export interface TabsProps {
    items?: TabItem[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
  }

  export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    className?: string;
  }

  export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    className?: string;
  }