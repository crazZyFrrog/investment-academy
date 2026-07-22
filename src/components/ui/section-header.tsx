import * as React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/design-system/typography";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}

function SectionHeader({
  className,
  title,
  description,
  eyebrow,
  action,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8",
        className
      )}
      {...props}
    >
      <div className="max-w-2xl space-y-3">
        {eyebrow ? <Typography variant="label">{eyebrow}</Typography> : null}
        <Typography variant="h2">{title}</Typography>
        {description ? (
          <Typography variant="body" className="text-text-secondary">
            {description}
          </Typography>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export { SectionHeader };
