import * as React from "react";
import { cn } from "@/lib/utils";
import type { DonutChartProps } from "./DonutChart.types";

const DonutChart = ({ ref, segments,
      centerText,
      centerSubtext,
      size = 160,
      strokeWidth = 24,
      gap = 2,
      showLegend = false,
      className,
      ...props }: DonutChartProps & { ref?: React.Ref<HTMLDivElement> }) => {
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const cx = size / 2;
    const cy = size / 2;
    const total = segments.reduce((s, seg) => s + seg.value, 0);

    let accumulated = 0;

    return (
      <div
        ref={ref}
        className={cn("inline-flex flex-col items-center gap-3", className)}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Donut chart"
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            segments.map((seg, i) => {
              const fullLength = (seg.value / total) * circumference;
              const displayLength = Math.max(0, fullLength - gap);
              const offset = circumference - accumulated;
              accumulated += fullLength;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${displayLength} ${circumference}`}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  strokeLinecap="butt"
                >
                  <title>
                    {seg.label}: {seg.value}
                  </title>
                </circle>
              );
            })}
          {centerText && (
            <text
              x={cx}
              y={centerSubtext ? cy - 10 : cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="18"
              fontWeight="700"
              fill="hsl(var(--foreground))"
            >
              {centerText}
            </text>
          )}
          {centerSubtext && (
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="hsl(var(--muted-foreground))"
            >
              {centerSubtext}
            </text>
          )}
        </svg>
        {showLegend && segments.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {segments.map((seg, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                  aria-hidden="true"
                />
                {seg.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

DonutChart.displayName = "DonutChart";

export { DonutChart };
