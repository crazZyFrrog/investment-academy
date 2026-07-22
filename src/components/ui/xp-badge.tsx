import * as React from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface XpBadgeProps extends Omit<BadgeProps, "children"> {
  value: number;
  showIcon?: boolean;
}

function formatXp(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function XpBadge({
  className,
  value,
  showIcon = true,
  variant = "soft",
  ...props
}: XpBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {showIcon ? <Zap className="size-3 fill-current" aria-hidden /> : null}
      <span>{formatXp(value)} XP</span>
    </Badge>
  );
}

export { XpBadge };
