import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface DurationBadgeProps extends Omit<BadgeProps, "children"> {
  minutes: number;
  showIcon?: boolean;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (remaining === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}m`;
}

function DurationBadge({
  className,
  minutes,
  showIcon = true,
  variant = "outline",
  ...props
}: DurationBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {showIcon ? <Clock className="size-3" aria-hidden /> : null}
      <span>{formatDuration(minutes)}</span>
    </Badge>
  );
}

export { DurationBadge, formatDuration };
