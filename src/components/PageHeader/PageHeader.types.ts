import * as React from "react";

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactElement;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  action?: PageHeaderAction;
}
