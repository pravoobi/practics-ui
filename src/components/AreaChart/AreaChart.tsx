import * as React from "react";
import { cn } from "@/lib/utils";
import type { AreaChartProps } from "./AreaChart.types";

const INTERNAL_WIDTH = 500;
const PADDING = { top: 16, right: 16, bottom: 36, left: 48 };

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(Math.round(v));
}

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      series,
      height = 220,
      showGrid = true,
      showLegend = true,
      className,
      ...props
    },
    ref
  ) => {
    const uid = React.useId().replace(/:/g, "");
    const chartW = INTERNAL_WIDTH - PADDING.left - PADDING.right;
    const chartH = height - PADDING.top - PADDING.bottom;

    const allValues = data.flatMap((d) =>
      series.map((s) =>
        typeof d[s.key] === "number" ? (d[s.key] as number) : 0
      )
    );
    const maxValue = Math.max(...allValues, 1);

    const xScale = (i: number) =>
      data.length < 2 ? chartW / 2 : (i / (data.length - 1)) * chartW;
    const yScale = (v: number) => chartH - (v / maxValue) * chartH;

    const buildLinePath = (key: string) =>
      data
        .map((d, i) => {
          const v = typeof d[key] === "number" ? (d[key] as number) : 0;
          return `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(2)} ${yScale(v).toFixed(2)}`;
        })
        .join(" ");

    const buildAreaPath = (key: string) => {
      if (data.length === 0) return "";
      const last = data.length - 1;
      return `${buildLinePath(key)} L ${xScale(last).toFixed(2)} ${chartH} L ${xScale(0).toFixed(2)} ${chartH} Z`;
    };

    const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLegend && series.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
            {series.map((s) => (
              <div
                key={s.key}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <span
                  className="inline-block w-3 h-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                  aria-hidden="true"
                />
                {s.name}
              </div>
            ))}
          </div>
        )}
        <svg
          viewBox={`0 0 ${INTERNAL_WIDTH} ${height}`}
          width="100%"
          role="img"
          aria-label="Area chart"
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={s.key}
                id={`${uid}-gradient-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
            {showGrid &&
              yTicks.map((t) => (
                <line
                  key={t}
                  x1={0}
                  y1={(1 - t) * chartH}
                  x2={chartW}
                  y2={(1 - t) * chartH}
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                  strokeDasharray={t === 0 ? undefined : "4 4"}
                />
              ))}
            {series.map((s) => (
              <path
                key={`area-${s.key}`}
                d={buildAreaPath(s.key)}
                fill={`url(#${uid}-gradient-${s.key})`}
              />
            ))}
            {series.map((s) => (
              <path
                key={`line-${s.key}`}
                d={buildLinePath(s.key)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {yTicks.map((t) => (
              <text
                key={`ylabel-${t}`}
                x={-8}
                y={(1 - t) * chartH}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="hsl(var(--muted-foreground))"
              >
                {formatValue(t * maxValue)}
              </text>
            ))}
            {data.map((d, i) => (
              <text
                key={`xlabel-${i}`}
                x={xScale(i)}
                y={chartH + 20}
                textAnchor="middle"
                fontSize="11"
                fill="hsl(var(--muted-foreground))"
              >
                {d.label}
              </text>
            ))}
          </g>
        </svg>
      </div>
    );
  }
);

AreaChart.displayName = "AreaChart";

export { AreaChart };
