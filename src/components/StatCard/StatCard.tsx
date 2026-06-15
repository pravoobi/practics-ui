import * as React from "react";
  import { Card, CardContent } from "@/components/Card";
  import { cn } from "@/lib/utils";
  import type { StatCardProps, StatTrend } from "./StatCard.types";

  const trendColorMap: Record<StatTrend, string> = {
    up: "text-green-600",
    down: "text-red-500",
    neutral: "text-muted-foreground",
  };

  const trendSymbolMap: Record<StatTrend, string> = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  const StatCard = ({ ref, label, value, change, trend = "neutral", icon, className }: StatCardProps & { ref?: React.Ref<HTMLDivElement> }) => (
      <Card ref={ref} className={cn("p-0", className)}>
        <CardContent className={"8"}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <span className="text-2xl font-bold text-foreground">
                {value}
              </span>
              {change && (
                <span
                  className={cn(
                    "text-xs font-medium flex items-center gap-0.5",
                    trendColorMap[trend]
                  )}
                >
                  {trendSymbolMap[trend]} {change}
                </span>
              )}
            </div>
            {icon && (
              <div className="text-muted-foreground shrink-0">{icon}</div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  StatCard.displayName = "StatCard";

  export { StatCard };