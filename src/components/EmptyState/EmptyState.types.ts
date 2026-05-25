import * as React from "react";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}
