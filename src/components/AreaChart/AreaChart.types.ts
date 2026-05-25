import * as React from "react";

export interface DataPoint {
  label: string;
  [key: string]: string | number;
}

export interface AreaSeries {
  key: string;
  name: string;
  color: string;
}

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DataPoint[];
  series: AreaSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}
