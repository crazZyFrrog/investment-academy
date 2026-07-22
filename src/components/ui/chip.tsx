import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@/design-system/icons";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border px-3.5 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)]",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-text-primary",
        selected: "border-primary/20 bg-primary/8 text-primary",
        muted: "border-transparent bg-muted text-text-secondary",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

function Chip({
  className,
  variant,
  size,
  selected,
  onRemove,
  icon,
  children,
  ...props
}: ChipProps) {
  const resolvedVariant = selected ? "selected" : variant;

  return (
    <span
      className={cn(chipVariants({ variant: resolvedVariant, size }), className)}
      {...props}
    >
      {icon}
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 text-text-tertiary hover:bg-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Remove"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </span>
  );
}

export { Chip, chipVariants };
