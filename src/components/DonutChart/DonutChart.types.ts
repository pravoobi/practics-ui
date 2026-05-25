import * as React from "react";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: DonutSegment[];
  centerText?: string;
  centerSubtext?: string;
  size?: number;
  strokeWidth?: number;
  gap?: number;
  showLegend?: boolean;
}
