import * as React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/design-system/typography";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-border bg-surface px-8 py-16 text-center shadow-xs",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-5 flex size-14 items-center justify-center rounded-[var(--radius-xl)] bg-muted text-text-tertiary [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <Typography variant="title">{title}</Typography>
      {description ? (
        <Typography
          variant="body"
          className="mt-3 max-w-sm text-text-secondary"
        >
          {description}
        </Typography>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
