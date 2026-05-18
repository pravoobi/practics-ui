import * as React from "react";

  export type StatTrend = "up" | "down" | "neutral";

  export interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    trend?: StatTrend;
    icon?: React.ReactNode;
    className?: string;
  }